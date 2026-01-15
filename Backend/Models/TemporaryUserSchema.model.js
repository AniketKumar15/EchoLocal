import mongoose from "mongoose";

const TemporaryUserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, index: true },
    ipHash: { type: String, unique: true, required: true, index: true }, // 1 account per IP
    deviceHash: { type: String },
}, { timestamps: true });

export default mongoose.model("TemporaryUser", TemporaryUserSchema);
