import ChatRoom from "../Models/ChatRoomSchema.model.js";
import Message from "../Models/MessageSchema.model.js";
import TemporaryUser from "../Models/TemporaryUserSchema.model.js";
import jwt from "jsonwebtoken";
import { io } from "../index.js";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
}
const SECRET = process.env.JWT_SECRET;

// ================= CREATE ROOM =================
export const createRoom = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, SECRET);
        const username = decoded.username;

        const user = await TemporaryUser.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "Host user not found" });
        }

        const { roomName, category, duration, coordinates } = req.body;

        if (!Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({ success: false, message: "Invalid coordinates" });
        }

        const expiryTime = new Date(
            Date.now() + (duration || 2) * 60 * 60 * 1000
        );

        const room = new ChatRoom({
            roomName,
            hostUser: user._id,
            hostUsername: user.username,
            category,
            duration: duration || 2,
            expiryTime,
            location: {
                type: "Point",
                coordinates
            }
        });

        await room.save();

        res.status(201).json({ success: true, room });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET NEARBY ROOMS =================
export const getNearbyRooms = async (req, res) => {
    try {
        const { lng, lat } = req.query;
        if (!lng || !lat) {
            return res.status(400).json({ success: false, message: "Coordinates required" });
        }

        const rooms = await ChatRoom.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[Number(lng), Number(lat)], 5 / 6378.1],
                },
            },
            expiryTime: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        res.json({ success: true, rooms });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET ROOM DETAILS =================
export const getRoomDetails = async (req, res) => {
    try {
        const room = await ChatRoom.findById(req.params.roomId);
        if (!room || room.expiryTime < new Date()) {
            return res.status(404).json({ success: false, message: "Room not found or expired" });
        }

        res.json({ success: true, room });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE ROOM =================
export const deleteRoom = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, SECRET);
        const username = decoded.username;

        const room = await ChatRoom.findById(req.params.roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        if (room.hostUsername !== username) {
            return res.status(403).json({ success: false, message: "Only host can delete the room" });
        }

        // Notify sockets before deletion
        io.to(room._id.toString()).emit("roomExpired");
        io.socketsLeave(room._id.toString());

        await ChatRoom.deleteOne({ _id: room._id });
        await Message.deleteMany({ roomId: room._id });

        res.json({ success: true, message: "Room deleted" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
