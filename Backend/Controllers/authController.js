import TemporaryUser from "../Models/TemporaryUserSchema.model.js";
import { generateUsername } from "../Utils/generateName.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "echoLocalSecretKey";

export const getRandomUsername = async (req, res) => {
    try {
        const ip = req.ip || "unknown";
        const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

        const existingIPUser = await TemporaryUser.findOne({ ipHash });
        if (existingIPUser) {
            const token = jwt.sign(
                { _id: existingIPUser._id, username: existingIPUser.username },
                SECRET
            );
            return res.json({
                _id: existingIPUser._id,
                username: existingIPUser.username,
                token
            });
        }
        let username;
        let exists = true;

        while (exists) {
            username = generateUsername();
            const user = await TemporaryUser.findOne({ username });
            if (!user) exists = false;
        }

        const newUser = new TemporaryUser({
            username,
            ipHash,
            deviceHash: req.headers["user-agent"],
        });

        await newUser.save(); // save first!

        const token = jwt.sign({ _id: newUser._id, username }, SECRET);
        res.json({ _id: newUser._id, username, token });

    } catch (error) {
        res.status(500).json({ message: "Error generating username", error });
    }
};

export const refreshUsername = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, SECRET);
        const oldUsername = decoded.username;

        await TemporaryUser.deleteOne({ username: oldUsername });

        let username;
        let exists = true;

        while (exists) {
            username = generateUsername();
            const user = await TemporaryUser.findOne({ username });
            if (!user) exists = false;
        }

        const ip = req.ip || "unknown";
        const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

        const newUser = new TemporaryUser({
            username,
            ipHash,
            deviceHash: req.headers["user-agent"],
        });

        await newUser.save();

        const newToken = jwt.sign({ _id: newUser._id, username }, SECRET);
        res.json({ _id: newUser._id, username, token: newToken });

    } catch (error) {
        res.status(500).json({ message: "Error refreshing username", error });
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
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });
        const decoded = jwt.verify(token, SECRET);
        const username = decoded.username;
        await TemporaryUser.deleteOne({ username });
        res.json({ message: "User logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error logging out user", error: err });
    }
};
