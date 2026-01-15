import React, { useState } from "react";
import RoomContext from "./RoomContext"
import toast from "react-hot-toast";

const RoomState = (props) => {
    const hostUrl = "http://localhost:3000/";

    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [loading, setLoading] = useState(false);

    // ================= CREATE ROOM =================
    const createRoom = async ({ roomName, category, duration, coordinates }) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login first");
                return;
            }

            const res = await fetch(`${hostUrl}api/chatrooms/createRoom`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    roomName,
                    category,
                    duration,
                    coordinates,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setRooms((prev) => [data.room, ...prev]);
                toast.success("Room created successfully!");
                return data.room;
            } else {
                toast.error(data.message || "Room creation failed");
            }
        } catch (error) {
            toast.error("Failed to create room");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ================= GET NEARBY ROOMS =================
    const getNearbyRooms = async (lng, lat) => {
        try {
            setLoading(true);

            const res = await fetch(
                `${hostUrl}api/chatrooms/nearby?lng=${lng}&lat=${lat}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();

            if (res.ok && data.success) {
                setRooms(data.rooms);
            } else {
                toast.error(data.message || "Failed to fetch rooms");
            }
        } catch (error) {
            toast.error("Error fetching nearby rooms");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ================= GET ROOM DETAILS =================
    const getRoomDetails = async (roomId) => {
        try {
            setLoading(true);

            const res = await fetch(`${hostUrl}api/chatrooms/${roomId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCurrentRoom(data.room);
                return data.room;
            } else {
                toast.error(data.message || "Room not found");
            }
        } catch (error) {
            toast.error("Failed to load room");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ================= DELETE ROOM =================
    const deleteRoom = async (roomId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Unauthorized");
                return;
            }

            const res = await fetch(`${hostUrl}api/chatrooms/${roomId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setRooms((prev) => prev.filter((room) => room._id !== roomId));
                setCurrentRoom(null);
                toast.success("Room deleted successfully");
            } else {
                toast.error(data.message || "Delete failed");
            }
        } catch (error) {
            toast.error("Failed to delete room");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoomContext.Provider
            value={{
                rooms,
                currentRoom,
                loading,
                createRoom,
                getNearbyRooms,
                getRoomDetails,
                deleteRoom,
                setCurrentRoom,
            }}
        >
            {props.children}
        </RoomContext.Provider>
    );
};

export default RoomState;
