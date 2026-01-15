import React, { useEffect, useState, useContext } from "react";
import { FaUserAstronaut, FaSearch, FaUserCircle, FaTrash } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import RoomCreateModal from "./RoomCreateModal";
import RoomContext from "../Contexts/RoomContexts/RoomContext";
import MessageContext from "../Contexts/MessageContext/MessageContext";
import { useNavigate } from "react-router-dom";


const SideBar = ({ user, refreshUsername, logoutUser, selectedRoom, setSelectedRoom }) => {
    const { rooms, getNearbyRooms, deleteRoom } = useContext(RoomContext);
    const { joinRoom, leaveRoom, currentRoomId } = useContext(MessageContext);
    const navigate = useNavigate();


    const [openCreateRoom, setOpenCreateRoom] = useState(false);
    const [coords, setCoords] = useState(null);
    const [open, setOpen] = useState(false);

    // Get user location
    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { longitude, latitude } = position.coords;
                setCoords([longitude, latitude]);
            },
            () => console.error("Location access denied")
        );
    }, []);

    // Fetch nearby rooms when coords ready
    useEffect(() => {
        if (coords) {
            getNearbyRooms(coords[0], coords[1]);
        }
    }, [coords]);

    const logoutNav = () => {
        leaveRoom();
        setSelectedRoom(null);
        logoutUser();
        navigate("/auth");
    }

    return (
        <div className="md:bg-white/10 h-[calc(100vh-1rem)] p-5 flex flex-col rounded-xl text-white mr-0 md:mr-2 backdrop-blur-xs">
            {/* HEADER */}
            <div className="pb-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FaUserAstronaut className="size-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                        <h1 className="text-lg font-semibold">EchoLocal</h1>
                    </div>


                    <div className="relative py-2">
                        <CiMenuKebab
                            className="size-5 cursor-pointer"
                            onClick={() => setOpen(!open)}
                        />

                        {open && (
                            <div className="absolute top-full right-0 z-20 w-32 p-4 rounded-md bg-[#282142] border border-gray-600">
                                <p
                                    className="cursor-pointer text-sm"
                                    onClick={() => {
                                        setOpen(false);
                                        setOpenCreateRoom(true);
                                    }}
                                >
                                    Create Room
                                </p>
                                <hr className="my-2 border-gray-500" />
                                <p
                                    className="cursor-pointer text-sm"
                                    onClick={() => {
                                        setOpen(false);
                                        refreshUsername();
                                    }}
                                >
                                    Refresh Username
                                </p>
                                <hr className="my-2 border-gray-500" />
                                <p
                                    className="cursor-pointer text-sm"
                                    onClick={() => {
                                        setOpen(false);
                                        logoutNav();
                                    }}
                                >
                                    Logout
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEARCH */}
                <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
                    <FaSearch className="size-3" />
                    <input
                        type="text"
                        className="bg-transparent outline-none text-xs flex-1"
                        placeholder="Search Room"
                    />
                </div>
            </div>

            {/* ROOM LIST */}
            <div className="flex-1 overflow-auto scrollbar-hide">
                {rooms.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10">No rooms available nearby. You can create one.</p>
                ) : (
                    <div className="flex flex-col gap-2 p-2">
                        {rooms.map((room) => {
                            const isSelected = selectedRoom?._id === room._id;
                            const isHost = room.hostUsername === user?.username;

                            return (
                                <div
                                    key={room._id}
                                    onClick={() => {
                                        // prevent re-joining same room
                                        if (currentRoomId === room._id) return;

                                        // leave previous room (disconnect socket)
                                        leaveRoom();

                                        // set UI state
                                        setSelectedRoom(room);

                                        // join new room
                                        joinRoom(room._id);
                                    }}
                                    className={`rounded-lg p-3 transition-colors cursor-pointer
                                ${isSelected ? "bg-indigo-600" : "bg-[#282142] hover:bg-[#3a305a]"}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <img src="./ChatRoom1.png" className="w-10 rounded-full" />
                                            <h3 className="font-medium">{room.roomName}</h3>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                                                {room.category}
                                            </span>

                                            {/* DELETE — HOST ONLY */}
                                            {isHost && (
                                                <FaTrash
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        if (selectedRoom?._id === room._id) {
                                                            leaveRoom();
                                                            setSelectedRoom(null);
                                                        }

                                                        deleteRoom(room._id);
                                                    }}

                                                    className="text-red-400 hover:text-red-500 cursor-pointer"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-300 mt-1">
                                        Duration: {room.duration} hours
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* USER INFO */}
            <div className="flex items-center justify-center gap-2 pt-4">
                <FaUserCircle className="size-7" />
                <span>{user?.username}</span>
            </div>

            <RoomCreateModal
                isOpen={openCreateRoom}
                onClose={() => setOpenCreateRoom(false)}
                coordinates={coords}
            />
        </div>
    );
};

export default SideBar;
