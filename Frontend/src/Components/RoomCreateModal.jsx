import React, { useState, useContext } from "react";
import RoomContext from "../Contexts/RoomContexts/RoomContext";

const RoomCreateModal = ({ isOpen, onClose, coordinates }) => {
    const { createRoom, loading } = useContext(RoomContext);

    const [roomName, setRoomName] = useState("");
    const [category, setCategory] = useState("General");
    const [duration, setDuration] = useState(2);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!roomName.trim()) return;

        const room = await createRoom({
            roomName,
            category,
            duration,
            coordinates,
        });

        if (room) {
            setRoomName("");
            setCategory("General");
            setDuration(2);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-xl bg-gray-900 p-6 text-white shadow-lg">

                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Create Chat Room</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Room name"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm outline-none ring-1 ring-gray-700 focus:ring-indigo-500"
                        required
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm outline-none ring-1 ring-gray-700 focus:ring-indigo-500"
                    >
                        <option>General</option>
                        <option>Gaming</option>
                        <option>Study</option>
                        <option>Meetup</option>
                        <option>Nearby</option>
                        <option>Riddle</option>
                        <option>Music</option>
                        <option>Other</option>
                    </select>

                    <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm outline-none ring-1 ring-gray-700 focus:ring-indigo-500"
                    >
                        <option value={2}>2 hour</option>
                        <option value={3}>3 hours</option>
                        <option value={4}>4 hours</option>
                        <option value={6}>6 hours</option>
                    </select>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomCreateModal;
