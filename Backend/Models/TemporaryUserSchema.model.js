import mongoose from "mongoose";

const TemporaryUserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, index: true },
    ipHash: { type: String },
    deviceHash: { type: String, unique: true, index: true },
}, { timestamps: true });

export default mongoose.model("TemporaryUser", TemporaryUserSchema);
