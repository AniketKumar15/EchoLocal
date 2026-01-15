import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },

    hostUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TemporaryUser",
        required: true
    },

    hostUsername: { type: String, required: true },

    category: {
        type: String,
        enum: ["Gaming", "General", "Study", "Meetup", "Nearby", "Riddle", "Music", "Other"],
        required: true
    },

    duration: {
        type: Number,
        enum: [2, 3, 4, 6],
        default: 2
    },

    expiryTime: {
        type: Date,
        required: true,
        index: true
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-calculate expiry
ChatRoomSchema.pre("save", function (next) {
    if (!this.expiryTime) {
        const expireDate = new Date(this.createdAt);
        expireDate.setHours(expireDate.getHours() + this.duration);
        this.expiryTime = expireDate;
    }

    if (typeof next === "function") {
        next();
    }
});

ChatRoomSchema.index({ location: "2dsphere" });

ChatRoomSchema.index(
    { expiryTime: 1 },
    { expireAfterSeconds: 0 }
);

export default mongoose.model("ChatRoom", ChatRoomSchema);
