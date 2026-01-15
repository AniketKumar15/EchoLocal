import React, { useContext, useEffect } from "react";
import AuthContext from "../Contexts/AuthContexts/AuthContext";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BackGround from "../Components/BackGround";


const AuthPage = () => {
  const { user, userNameGenerate } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleGenerate = async () => {
    await userNameGenerate(); // generate username
    navigate("/"); // redirect to home page
  };

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen text-white overflow-hidden">
      <BackGround />
      {/* LEFT SECTION */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-5">
        <FaUserAstronaut className="text-5xl md:text-7xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
        <h1 className="text-3xl md:text-5xl font-black tracking-widest mb-6 text-center md:text-left">ECHO LOCAL</h1>

        <button
          onClick={handleGenerate}
          className="px-8 md:px-10 py-3 md:py-4 bg-white text-black font-extrabold rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.25)] mb-3 md:mb-0"
        >
          GENERATE USERNAME
        </button>

        <p className="text-gray-400 mt-3 text-sm tracking-wide text-center md:text-left">
          Enter as a temporary user — no personal data required.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-2 px-5 ">
        <div className="w-full max-h-[calc(100vh-1rem)] overflow-auto p-5 md:p-7 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,150,255,0.12)]">
          <h2 className="text-3xl font-bold mb-4 tracking-wide">Website Policy — EchoLocal</h2>

          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            EchoLocal is an anonymous, location-based chatroom platform designed for short-lived, history-free conversations. By using this platform, you agree to the following rules and policies:
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">1. 🕵️ Anonymous Identity</h3>
          <ul className="text-gray-300 text-sm leading-relaxed mb-3 list-disc ml-5">
            <li>Every user receives a random temporary username.</li>
            <li>You can refresh the name anytime, but it does not represent a real identity.</li>
            <li>User sessions expire automatically when inactive or after a set time.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">2. 📍 Location-Based Rooms</h3>
          <ul className="text-gray-300 text-sm leading-relaxed mb-3 list-disc ml-5">
            <li>Chatrooms are not tied to real GPS tracking. The 5km rule works on a privacy-safe nearby matching system.</li>
            <li>EchoLocal never stores or exposes precise user location to others.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">3. ⏳ Ephemeral Chatrooms</h3>
          <ul className="text-gray-300 text-sm leading-relaxed mb-3 list-disc ml-5">
            <li>Rooms auto-delete after 2 hours by default.</li>
            <li>Hosts may extend duration to 3, 4, or 6 hours.</li>
            <li>Setting duration beyond 6 hours makes the room infinite, but messages still disappear after room deletion.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">4. 🚫 No Chat History</h3>
          <ul className="text-gray-300 text-sm leading-relaxed mb-3 list-disc ml-5">
            <li>EchoLocal does not store readable chat history.</li>
            {/* <li>All messages are end-to-end encrypted before being saved.</li>
            <li>Once a room expires or a username is refreshed, old messages cannot be recovered or decrypted.</li> */}
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">5. ⚠ Prohibited Activities</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">
            Users must NOT use EchoLocal for:
          </p>
          <ul className="text-red-400 text-sm leading-relaxed mb-3 list-disc ml-5">
            <li>Scamming, fraud, phishing, or impersonation</li>
            <li>Sharing illegal content, hacking, drugs, weapons, or explicit materials</li>
            <li>Threats, hate speech, violence, or harassment</li>
            <li>Spreading misinformation or organizing illegal acts</li>
          </ul>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            If detected, users may be banned permanently or temporarily.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">6. 🛡 Safety & Reporting</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">Rooms and users include a Report System.</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">We take action using:</p>
          <ul className="text-yellow-400 text-sm leading-relaxed mb-3 list-disc ml-5">
            <li>Temporary or infinite bans</li>
            <li>Room deletion</li>
            <li>Message discard</li>
            <li>IP + device fingerprint flagging</li>
          </ul>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            EchoLocal is for safe, fun, and free conversations, not misuse.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">7. 📌 Disclaimer</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            EchoLocal does not reveal personal data, but misuse can still be reported to authorities if required by law.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            You are responsible for what you send.
          </p>

          <p className="text-gray-500 text-xs mt-4">
            * EchoLocal does not retain chat history. Users are responsible for their own actions.
          </p>
        </div>
      </div>

      <style>{`
      /* width */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.05);
        border-radius: 10px;
      }

      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #6366f1, #8b5cf6);
        border-radius: 10px;
      }

      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        opacity: 0.8;
      }
    `}</style>

    </div>
  );
};

export default AuthPage;
