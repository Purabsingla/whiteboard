import React, { useState, useEffect } from "react";
import DrawingCanvas from "./DrawingCanvas.jsx";
import Toolbar from "./Toolbar.jsx";
import UserCursors from "./UserCursor.jsx";
import { io } from "socket.io-client";

const socket = io("https://whiteboard-d7uj.onrender.com");

export default function Whiteboard({ roomId, username }) {
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(3);

  useEffect(() => {
    console.log("Joining room:", roomId, "as:", username);

    // socket.emit("join-room", { roomId, username });

    // socket.on("room-users", ({ users, count }) => {
    //   console.log("📊 Room users updated:", { users, count });
    //   setUsers(users || []);
    //   setUserCount(count || 0);
    // });

    // socket.on("connect", () => {
    //   console.log("🔗 Connected to server");
    //   // Rejoin room on reconnection
    //   socket.emit("join-room", { roomId, username });
    // });

    // Join room
    socket.emit("join-room", { roomId, username });

    socket.on("room-users", ({ users, count }) => {
      console.log("📊 Room users updated:", { users, count });
      setUsers(users || []);
      setUserCount(count || 0);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    return () => {
      // socket.emit("leave-room", { roomId });
      socket.off("room-users");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [roomId, username]);

  const handleClearCanvas = () => {
    socket.emit("clear-canvas", { roomId });
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw", // FULL SCREEN WIDTH
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#2c3e50",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Header - Full width */}
      <div
        style={{
          padding: "12px 20px",
          backgroundColor: "#34495e",
          color: "white",
          borderBottom: "2px solid #2c3e50",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          minHeight: "60px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.6rem",
            fontWeight: "bold",
            color: "#ecf0f1",
          }}
        >
          🎨 Collaborative Whiteboard - Room:{" "}
          <span style={{ color: "#3498db" }}>{roomId}</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              backgroundColor: userCount > 1 ? "#27ae60" : "#e74c3c",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "1rem",
              fontWeight: "bold",
              color: "white",
              minWidth: "120px",
              textAlign: "center",
            }}
          >
            👥 {userCount} User{userCount !== 1 ? "s" : ""} Online
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              opacity: 0.9,
              maxWidth: "300px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {users.length > 0
              ? users.map((u) => u.name).join(", ")
              : "Loading users..."}
          </div>
        </div>
      </div>

      {/* Toolbar - Full width */}
      <Toolbar
        color={brushColor}
        setColor={setBrushColor}
        width={brushWidth}
        setWidth={setBrushWidth}
        onClear={handleClearCanvas}
      />

      {/* Canvas Container - FULL SCREEN WIDTH */}
      <div
        style={{
          flex: 1,
          position: "relative",
          width: "100vw", // FULL WIDTH
          height: "calc(100vh - 120px)", // Account for header and toolbar
          backgroundColor: "white",
          overflow: "hidden",
        }}
      >
        <DrawingCanvas
          roomId={roomId}
          color={brushColor}
          width={brushWidth}
          socket={socket}
        />
        <UserCursors roomId={roomId} users={users} socket={socket} />
      </div>
    </div>
  );
}
