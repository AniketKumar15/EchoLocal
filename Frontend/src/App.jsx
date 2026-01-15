import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import PrivateRoute from "./Components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import AuthState from "./Contexts/AuthContexts/AuthState";
import RoomState from "./Contexts/RoomContexts/RoomState";
import MessageState from "./Contexts/MessageContext/MessageState";

function App() {
  return (
    <>
      <AuthState>
        <RoomState>
          <MessageState>
            <Toaster position="top-right" />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </MessageState>
        </RoomState>
      </AuthState>
    </>
  );
}

export default App;
