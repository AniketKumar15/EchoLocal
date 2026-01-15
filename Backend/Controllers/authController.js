import TemporaryUser from "../Models/TemporaryUserSchema.model.js";
import { generateUsername } from "../Utils/generateName.js";
import jwt from "jsonwebtoken";
import { hashValue, getClientIP } from "../Utils/identity.js";

const SECRET = process.env.JWT_SECRET;

export const getRandomUsername = async (req, res) => {
    try {
        const deviceId = req.headers["x-device-id"];
        if (!deviceId) {
            return res.status(400).json({ message: "Device ID missing" });
        }

        const deviceHash = hashValue(deviceId);
        const ipHash = hashValue(getClientIP(req));

        // Find by DEVICE (primary identity)
        let user = await TemporaryUser.findOne({ deviceHash });

        if (user) {
            const token = jwt.sign(
                { _id: user._id, username: user.username },
                SECRET,
                { expiresIn: "7d" }
            );

            return res.json({
                _id: user._id,
                username: user.username,
                token
            });
        }

        // Generate unique username
        let username;
        let exists = true;

        while (exists) {
            username = generateUsername();
            exists = await TemporaryUser.exists({ username });
        }

        user = await TemporaryUser.create({
            username,
            ipHash,
            deviceHash,
        });

        const token = jwt.sign(
            { _id: user._id, username },
            SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            _id: user._id,
            username,
            token
        });

    } catch (err) {
        res.status(500).json({
            message: "Error generating username",
            error: err.message
        });
    }
};


export const refreshUsername = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });

        const decoded = jwt.verify(token, SECRET);
        const deviceId = req.headers["x-device-id"];
        if (!deviceId) {
            return res.status(400).json({ message: "Device ID missing" });
        }

        const deviceHash = hashValue(deviceId);

        let user = await TemporaryUser.findOne({ deviceHash });
        if (!user) return res.status(404).json({ message: "User not found" });

        let username;
        let exists = true;

        while (exists) {
            username = generateUsername();
            exists = await TemporaryUser.exists({ username });
        }

        user.username = username;
        await user.save();

        const newToken = jwt.sign(
            { _id: user._id, username },
            SECRET,
            { expiresIn: "7d" }
        );

        res.json({ _id: user._id, username, token: newToken });

    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};


export const getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, SECRET);
        const username = decoded.username;

        const user = await TemporaryUser.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ active: true, _id: user._id, username, token });

    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const deviceId = req.headers["x-device-id"];
        if (!deviceId) return res.sendStatus(400);

        const deviceHash = hashValue(deviceId);
        await TemporaryUser.deleteOne({ deviceHash });

        res.json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Logout failed" });
    }
};

