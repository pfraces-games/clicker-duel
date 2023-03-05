import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ref, set, push } from "firebase/database";
import { db } from "./db";
import Header from "./layout/Header/Header";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./views/Login/Login";
import Rooms from "./views/Rooms/Rooms";
import Room from "./views/Room/Room";
import "./App.css";

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const onLogin = (userName) => {
    const playersRef = ref(db, "players");
    const userRef = push(playersRef);
    const loggedUser = { name: userName, key: userRef.key };
    set(userRef, loggedUser);
    setUser(loggedUser);
    navigate("/");
  };

  const onRoom = (room) => {
    setUser((x) => ({ ...x, room }));
    navigate(`/rooms/${room}`);
  };

  return (
    <div className="App">
      <Header user={user} />

      <div className="Routes">
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Navigate to="/rooms" replace />} />
            <Route path="/login" element={<Login onLogin={onLogin} />} />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute user={user}>
                  <Rooms user={user} onRoom={onRoom} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id"
              element={
                <ProtectedRoute user={user}>
                  <Room user={user} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
