import mongoose from "mongoose";

const BanSchema = new mongoose.Schema({
    banHash: { type: String, unique: true, required: true }, // IP or device hash
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date } // if null → infinite ban
});

// Auto unban if expiry passes
BanSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Ban", BanSchema);
