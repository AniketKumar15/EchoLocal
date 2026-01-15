import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import MessageContext from "./MessageContext";

const MessageState = ({ children }) => {
    const hostUrl = "https://echolocal-backend.onrender.com";

    const socketRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [loading, setLoading] = useState(false);
    let song = new Audio("/pickupCoin.wav");




    // ================= INIT SOCKET =================
    const connectSocket = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Login required");
            return;
        }

        if (socketRef.current) return;

        socketRef.current = io(hostUrl, {
            auth: { token },
            transports: ["websocket"],
        });

        socketRef.current.on("connect", () => {
            console.log("🟢 Socket connected");
        });

        socketRef.current.on("disconnect", () => {
            console.log("🔴 Socket disconnected");
        });

        // Receive realtime message
        socketRef.current.on("receiveMessage", (data) => {
            setMessages((prev) => [...prev, data]);
            song.play();

        });

        // Room expired
        socketRef.current.on("roomExpired", () => {
            toast.error("Room expired");
            setMessages([]);
            setCurrentRoomId(null);
            setUsersCount(0);
        });

        // Users count
        socketRef.current.on("roomUsersCount", ({ count }) => {
            setUsersCount(count);
        });
    };

    // ================= JOIN ROOM =================
    const joinRoom = async (roomId) => {
        if (!roomId) return;

        connectSocket();

        setLoading(true);
        setMessages([]);
        setCurrentRoomId(roomId);

        try {
            // Fetch old messages
            const res = await fetch(`${hostUrl}/api/messages/${roomId}`);
            const data = await res.json();

            if (res.ok && data.success) {
                setMessages(data.messages);
            } else {
                toast.error(data.message || "Failed to load messages");
            }

            if (socketRef.current.connected) {
                socketRef.current.emit("joinRoom", roomId);
            } else {
                socketRef.current.once("connect", () => {
                    socketRef.current.emit("joinRoom", roomId);
                });
            }

        } catch (error) {
            toast.error("Failed to join room");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ================= SEND MESSAGE =================
    const sendMessage = (text) => {
        if (!text || !currentRoomId) return;

        socketRef.current.emit("sendMessage", {
            roomId: currentRoomId,
            message: text,
        });
    };

    // ================= LEAVE ROOM =================
    const leaveRoom = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        setMessages([]);
        setCurrentRoomId(null);
        setUsersCount(0);
    };

    // ================= CLEANUP =================
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return (
        <MessageContext.Provider
            value={{
                messages,
                usersCount,
                currentRoomId,
                loading,
                joinRoom,
                sendMessage,
                leaveRoom,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export default MessageState;
