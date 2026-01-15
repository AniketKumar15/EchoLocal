import Message from "../Models/MessageSchema.model.js";
import ChatRoom from "../Models/ChatRoomSchema.model.js";

// ❌ NO sendMessage via HTTP
// Messages are sent ONLY via Socket.IO

// ================= GET ROOM MESSAGES =================
export const getRoomMessages = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await ChatRoom.findById(roomId);
        if (!room || room.expiryTime < new Date()) {
            return res.status(404).json({
                success: false,
                message: "Room not found or expired"
            });
        }

        const messages = await Message.find({ roomId })
            .sort({ createdAt: 1 })
            .select("text senderUsername createdAt");

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
