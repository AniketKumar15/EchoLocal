import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatRoom",
            required: true,
            index: true
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TemporaryUser",
            required: true
        },

        senderUsername: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true
        },

        // Auto-delete message when room expires
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }
        }
    },
    { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
