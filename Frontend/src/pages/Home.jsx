import React, { useContext, useState } from "react";
import AuthContext from "../Contexts/AuthContexts/AuthContext";
import SideBar from "../Components/SideBar";
import BackGround from "../Components/BackGround";
import ChatContainer from "../Components/ChatContainer";

const Home = () => {
    const { user, refreshUsername, logoutUser } = useContext(AuthContext);
    const [selectedRoom, setSelectedRoom] = useState(null);

    return (
        <div className="h-dvh w-full text-white p-0 md:p-2 ">
            <BackGround />
            {/* Grid Layout */}
            <div className="h-full overflow-hidden grid grid-cols-1 relative md:grid-cols-[0.5fr_1.5fr]">
                <SideBar user={user} refreshUsername={refreshUsername} logoutUser={logoutUser} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
                <ChatContainer selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
            </div>


        </div>
    );
};

export default Home;
