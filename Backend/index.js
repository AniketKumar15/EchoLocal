import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import connectToMongo from "./db.js";
import ChatRoom from "./Models/ChatRoomSchema.model.js";
import Message from "./Models/MessageSchema.model.js";


import authRoutes from "./Routes/authRoutes.js";
import chatRoomRoutes from "./Routes/chatRoomRoutes.js";
import messageRoutes from "./Routes/MessageRoutes.js";

// ================= ENV =================
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
}

const SECRET = process.env.JWT_SECRET;

// ================= APP =================
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// ================= DB =================
connectToMongo();

// ================= SOCKET.IO =================
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// roomId -> Set(socketId)
const roomSocketsMap = {};

// ---------- SOCKET AUTH ----------
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Unauthorized"));

        const decoded = jwt.verify(token, SECRET);
        socket.user = decoded; // { username }
        socket.lastMessageAt = 0;

        next();
    } catch {
        next(new Error("Invalid token"));
    }
});

// ---------- SOCKET EVENTS ----------
io.on("connection", (socket) => {
    // console.log("Connected:", socket.id, socket.user.username);

    // JOIN ROOM (click = join)
    socket.on("joinRoom", async (roomId) => {
        if (!roomId) {
            socket.emit("errorMessage", "Invalid room");
            return;
        }

        // Leave all previous rooms (single-room rule)
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
                cleanupRoom(room, socket.id);
            }
        }

        const room = await ChatRoom.findById(roomId);
        if (!room || room.expiryTime < new Date()) {
            socket.emit("roomExpired");
            return;
        }

        socket.join(roomId);

        if (!roomSocketsMap[roomId]) {
            roomSocketsMap[roomId] = new Set();
        }

        roomSocketsMap[roomId].add(socket.id);

        io.to(roomId).emit("roomUsersCount", {
            roomId,
            count: roomSocketsMap[roomId].size
        });

        emitOnlineRooms();
    });

    // SEND MESSAGE
    socket.on("sendMessage", async ({ roomId, message }) => {
        if (!roomId || !message) return;

        // Spam protection (500ms)
        if (Date.now() - socket.lastMessageAt < 500) return;
        socket.lastMessageAt = Date.now();

        const room = await ChatRoom.findById(roomId);
        if (!room || room.expiryTime < new Date()) {
            socket.emit("roomExpired");
            return;
        }

        await Message.create({
            roomId,
            senderId: socket.user._id || null, // safe fallback
            senderUsername: socket.user.username,
            text: message,
            expiresAt: room.expiryTime
        });

        io.to(roomId).emit("receiveMessage", {
            roomId,
            text: message,
            senderId: socket.user._id,
            senderUsername: socket.user.username,
            createdAt: new Date()
        });
    });

    // DISCONNECT
    socket.on("disconnect", () => {
        for (const roomId in roomSocketsMap) {
            cleanupRoom(roomId, socket.id);
        }
        emitOnlineRooms();
        // console.log("Disconnected:", socket.id);
    });
});

// ================= ROOM CLEANUP =================
function cleanupRoom(roomId, socketId) {
    if (!roomSocketsMap[roomId]) return;

    roomSocketsMap[roomId].delete(socketId);

    io.to(roomId).emit("roomUsersCount", {
        roomId,
        count: roomSocketsMap[roomId].size
    });

    if (roomSocketsMap[roomId].size === 0) {
        delete roomSocketsMap[roomId];
    }
}

function emitOnlineRooms() {
    const rooms = Object.entries(roomSocketsMap).map(
        ([roomId, sockets]) => ({
            roomId,
            count: sockets.size
        })
    );
    io.emit("onlineRooms", rooms);
}

// ================= AUTO-EXPIRE ROOMS =================
// Runs every 1 minute
setInterval(async () => {
    const now = new Date();

    const expiredRooms = await ChatRoom.find({
        expiryTime: { $lt: now }
    }).select("_id");

    for (const room of expiredRooms) {
        const roomId = room._id.toString();

        io.to(roomId).emit("roomExpired");
        io.socketsLeave(roomId);

        delete roomSocketsMap[roomId];
    }

    await ChatRoom.deleteMany({ expiryTime: { $lt: now } });
    await Message.deleteMany({ expiresAt: { $lt: now } });
}, 60 * 1000);

// ================= ROUTES =================
app.get("/", (req, res) => {
    res.json({
        active: true,
        message: "EchoLocal server running"
    });
});

app.use("/api/status", (req, res) => res.send("Server is up and running"));
app.use("/api/auth", authRoutes);
app.use("/api/chatrooms", chatRoomRoutes);
app.use("/api/messages", messageRoutes);

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// // ================= DEV ENV SETUP =================
// if (process.env.NODE_ENV !== "production") {
//     const PORT = process.env.PORT || 3000;
//     server.listen(PORT, () => {
//         console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
// }

// export default server;
