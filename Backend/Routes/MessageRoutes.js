import express from "express";
import { getRoomMessages } from "../Controllers/MessageController.js";

const router = express.Router();

// GET → fetch room messages
router.get("/:roomId", getRoomMessages);

export default router;
