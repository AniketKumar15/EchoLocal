// utils/identity.js
import crypto from "crypto";

export const hashValue = (value) =>
    crypto.createHash("sha256").update(value).digest("hex");

export const getClientIP = (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) return forwarded.split(",")[0].trim();
    return req.socket.remoteAddress || "unknown";
};
