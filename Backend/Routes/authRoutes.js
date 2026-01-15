import express from "express";
import { getRandomUsername, refreshUsername, getCurrentUser, logoutUser } from "../Controllers/authController.js";

const router = express.Router();

// Get random username + temp JWT
router.get("/random-name", getRandomUsername);
router.get("/current-user", getCurrentUser);

// Refresh username (delete old → generate new)
router.post("/refresh-name", refreshUsername);
// Logout user (delete temp user)
router.delete("/logout", logoutUser);

export default router;
