import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
    targetType: { type: String, required: true, enum: ["room", "message", "user"] },
    targetId: { type: String, required: true },
    reason: { type: String, required: true, enum: ["Spam", "Scam", "Abuse", "HateSpeech", "Other"] },
    reporterHash: { type: String, required: true }, // hashed IP/device, not identity
    createdAt: { type: Date, default: Date.now, expires: 86400 } // reports stored 24hr only
});

export default mongoose.model("Report", ReportSchema);
