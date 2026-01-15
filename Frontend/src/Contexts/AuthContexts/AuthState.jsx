import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import toast from "react-hot-toast";

const AuthState = (props) => {
    const [user, setUser] = useState(null);

    const hostUrl = "https://echo-local-backend.vercel.app/";

    // 1. Generate Random Username
    const userNameGenerate = async () => {
        try {
            const res = await fetch(`${hostUrl}api/auth/random-name`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok && data.token) {
                const newUser = { _id: data._id, username: data.username, token: data.token };
                setUser(newUser);
                localStorage.setItem("token", data.token);
                toast.success("Successfully Username Generated!", { duration: 4000 });
            } else {
                toast.error(data.message || "Username generation failed");
            }
        } catch (err) {
            toast.error("Generate name failed", { duration: 4000 });
            console.error(err);
        }
    };

    // 2. Refresh Username
    const refreshUsername = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No user logged in", { duration: 4000 });
                return;
            }

            const res = await fetch(`${hostUrl}api/auth/refresh-name`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok && data.token) {
                const updatedUser = { _id: data._id, username: data.username, token: data.token };
                setUser(updatedUser);
                localStorage.setItem("token", data.token);
                toast.success("Username refreshed!", { duration: 4000 });
            } else {
                toast.error(data.message || "Refresh failed", { duration: 4000 });
            }
        } catch (err) {
            toast.error("Refresh username failed", { duration: 4000 });
            console.error(err);
        }
    };

    // 3. Get Current User
    const getCurrentUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`${hostUrl}api/auth/current-user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok && data.active) {
                setUser({ _id: data._id, username: data.username, token });
            } else {
                localStorage.removeItem("token");
                setUser(null);
            }
        } catch (err) {
            console.error("Session expired", err);
            localStorage.removeItem("token");
            setUser(null);
        }
    };

    // 4. Logout User
    const logoutUser = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${hostUrl}api/auth/logout`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.ok) {
                localStorage.removeItem("token");
                setUser(null);
                toast.success("Logged out successfully", { duration: 4000 });
            } else {
                toast.error("Logout failed", { duration: 4000 });
            }
        } catch (err) {
            toast.error("Logout failed", { duration: 4000 });
            console.error(err);
        }
    };

    // Auto-load session on app start
    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                userNameGenerate,
                refreshUsername,
                getCurrentUser,
                logoutUser,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthState;
