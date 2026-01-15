import React from "react";

const FloatingShape = ({ size, top, left, delay, borderRadius }) => {
    return (
        <div
            className="absolute bg-white/10 opacity-60 animate-float"
            style={{
                width: size,
                height: size,
                top,
                left,
                animationDelay: delay,
                borderRadius,
            }}
        ></div>
    );
};

const BackGround = () => {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden">
            {/* Floating shapes */}
            <FloatingShape size="140px" top="12%" left="8%" delay="0s" borderRadius="50%" />
            <FloatingShape size="100px" top="65%" left="85%" delay="1.2s" borderRadius="20px" />
            <FloatingShape size="160px" top="50%" left="3%" delay="2.5s" borderRadius="40px" />
            <FloatingShape size="90px" top="82%" left="30%" delay="0.8s" borderRadius="12px" />
            <FloatingShape size="120px" top="5%" left="78%" delay="3.7s" borderRadius="50%" />
            <FloatingShape size="70px" top="30%" left="60%" delay="1.9s" borderRadius="8px" />

            {/* Floating animation */}
            <style>
                {`@keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(6deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-float {
                    animation: float 6.5s ease-in-out infinite;
                }`}
            </style>
        </div>
    );
};

export default BackGround;
