import express from "express";
import { createRoom, getNearbyRooms, getRoomDetails, deleteRoom } from "../Controllers/chatRoomController.js";

const router = express.Router();

router.post("/createRoom", createRoom); // create room (auth decoded inside controller)
router.get("/nearby", getNearbyRooms); // 5km range filter
router.get("/:roomId", getRoomDetails); // single room details
router.delete("/:roomId", deleteRoom); // delete room (host check inside controller)

export default router;
