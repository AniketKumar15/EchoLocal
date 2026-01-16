import React, { useContext, useEffect, useRef, useState } from "react";
import { FaUserAstronaut, FaArrowLeft } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import MessageContext from "../Contexts/MessageContext/MessageContext";
import AuthContext from "../Contexts/AuthContexts/AuthContext";
import InputEmoji from 'react-input-emoji'

const ChatContainer = ({ selectedRoom, setSelectedRoom }) => {
    const { messages, sendMessage, usersCount, leaveRoom } = useContext(MessageContext);
    const { user } = useContext(AuthContext);

    const [text, setText] = useState("");
    const [timeLeft, setTimeLeft] = useState("");

    const bottomRef = useRef(null);

    // auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!selectedRoom?.expiryTime) {
            setTimeLeft("");
            return;
        }

        const pad = (n) => String(n).padStart(2, "0");
        const expiry = new Date(selectedRoom.expiryTime);

        const updateTimer = () => {
            const diff = expiry - new Date();

            if (diff <= 0) {
                setTimeLeft("Expired");
                return;
            }

            const totalSeconds = Math.floor(diff / 1000);
            const hrs = Math.floor(totalSeconds / 3600);
            const mins = Math.floor((totalSeconds % 3600) / 60);
            const secs = totalSeconds % 60;

            setTimeLeft(`${pad(hrs)}:${pad(mins)}:${pad(secs)}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [selectedRoom?.expiryTime]);


    if (!selectedRoom) {
        return (
            <div className="bg-white/10 h-full p-5 rounded-xl text-white backdrop-blur-xs max-md:hidden flex flex-col items-center justify-center gap-2">
                <FaUserAstronaut className="size-16 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                <h2 className="text-2xl font-semibold">Select a Room to Start Chatting</h2>
                <p className="text-center text-sm max-w-md">
                    Choose a chat room from the sidebar to join the conversation and connect with others!
                </p>
            </div>
        );
    }

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage(text.trim());
        setText("");
    };

    const getUserColor = (username) => {
        if (!username) return "hsl(220, 70%, 60%)";

        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 70%, 55%)`;
    };


    return (
        <div className="md:bg-white/10 h-[calc(100dvh-1rem)] relative p-0 md:p-5 rounded-xl text-white backdrop-blur-xs overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center py-3 mx-2 md:mx-4 border-b border-stone-500">
                <div className="flex items-center gap-2 basis-1/3">
                    <img src="./ChatRoom1.png" className="w-10 rounded-full" />
                    <h3 className="font-medium truncate">{selectedRoom.roomName}</h3>
                </div>

                <div className="basis-1/3 flex justify-center">
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                        {selectedRoom.category} · {usersCount} online
                    </span>
                </div>

                <div className="basis-1/3 flex justify-end items-center gap-3">
                    <p className={`text-xs px-2 py-1 rounded-full
                        ${timeLeft === "Expired"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                    >
                        ⏳ {timeLeft}
                    </p>
                    <FaArrowLeft
                        className="size-4 cursor-pointer"
                        onClick={() => {
                            leaveRoom();
                            setSelectedRoom(null);
                        }}
                    />
                </div>
            </div>

            {/* MESSAGES */}
            <div className="flex flex-col h-[calc(100%-120px)] overflow-y-auto p-4 pb-6 scrollbar-hide">
                {messages.map((msg, idx) => {
                    const isMe = msg.senderUsername === user?.username;

                    return (
                        <div
                            key={idx}
                            className={`flex gap-3 mb-4 ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            {/* AVATAR (only others) */}
                            {!isMe && (
                                <div className="shrink-0 mt-1">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center shadow-md ring-1 ring-white/20"
                                        style={{ backgroundColor: getUserColor(msg.senderUsername) }}
                                    >
                                        <FaUserAstronaut className="text-sm" />
                                    </div>
                                </div>
                            )}

                            {/* MESSAGE BUBBLE */}
                            <div
                                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-transform duration-150
                                    ${isMe
                                        ? "bg-[#6d5dfc] rounded-br-md shadow-black/20 shadow-sm"
                                        : "bg-gray-700/60 rounded-bl-md shadow-black/20 shadow-sm"
                                    }`}

                            >
                                {/* USERNAME (only others) */}
                                {!isMe && (
                                    <p
                                        className="text-xs mb-1 font-medium"
                                        style={{ color: getUserColor(msg.senderUsername) }}
                                    >
                                        {msg.senderUsername}
                                    </p>
                                )}

                                {/* MESSAGE TEXT */}
                                <p className="text-white">
                                    {msg.message || msg.text}
                                </p>

                                {/* TIME */}
                                <div className="text-[10px] opacity-60 mt-1 text-right">
                                    {new Date(msg.time || msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>

                            {/* SPACER FOR ALIGNMENT (me) */}
                            {isMe && <div className="md:w-8" />}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>


            {/* INPUT */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
                <div className="flex-1 hidden items-center md:flex gap-2 px-4 rounded-2xl
                bg-gray-100/12 backdrop-blur-md border border-white/10
                focus-within:border-indigo-400/40 transition">
                    <InputEmoji
                        type="text"
                        value={text}
                        onChange={setText}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Message"
                        background="none"
                        color="white"
                        borderColor="transparent"
                        shouldReturn

                    />
                    <button
                        className="p-2 rounded-full bg-indigo-500/90 active:scale-95
                   transition-transform" onClick={handleSend}
                    >
                        <IoMdSend className="w-4 h-4 text-white" />
                    </button>
                </div>
                <div className="flex-1 flex items-center md:hidden gap-2 px-4 py-2 rounded-2xl
                bg-white/10 backdrop-blur-md border border-white/10
                focus-within:border-indigo-400/40 transition">

                    <input
                        type="text"
                        placeholder="Message"
                        className="flex-1 bg-transparent text-sm text-white placeholder-gray-400
                   outline-none py-2"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <button
                        className="p-2 rounded-full bg-indigo-500/90 active:scale-95
                   transition-transform" onClick={handleSend}
                    >
                        <IoMdSend className="w-4 h-4 text-white" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ChatContainer;
