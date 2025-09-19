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
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Glassmorphism Header */}
      <div
        style={{
          padding: "16px 24px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          minHeight: "72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            zIndex: 1,
          }}
        >
          {/* Animated logo */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #ff6b6b, #ffa726)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              boxShadow: "0 8px 25px rgba(255, 107, 107, 0.3)",
              animation: "logoFloat 3s ease-in-out infinite",
            }}
          >
            🎨
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.75rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #fff, #f0f8ff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              Whiteboard Live
            </h1>
            <div
              style={{
                fontSize: "0.9rem",
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: 500,
                marginTop: "2px",
              }}
            >
              Room:{" "}
              <span
                style={{
                  color: "#64ffda",
                  fontWeight: 600,
                  textShadow: "0 0 10px rgba(100, 255, 218, 0.3)",
                }}
              >
                {roomId}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            zIndex: 1,
          }}
        >
          {/* Active users display */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255, 255, 255, 0.1)",
              padding: "10px 16px",
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background:
                    userCount > 1
                      ? "linear-gradient(135deg, #4ade80, #22c55e)"
                      : "linear-gradient(135deg, #f87171, #ef4444)",
                  boxShadow:
                    userCount > 1
                      ? "0 0 15px rgba(74, 222, 128, 0.5)"
                      : "0 0 15px rgba(248, 113, 113, 0.5)",
                  animation: "pulse 2s infinite",
                }}
              />
              <span
                style={{
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                }}
              >
                {userCount} User{userCount !== 1 ? "s" : ""} Online
              </span>
            </div>
          </div>

          {/* User list */}
          <div
            style={{
              fontSize: "0.85rem",
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: "280px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: 500,
              background: "rgba(255, 255, 255, 0.05)",
              padding: "8px 12px",
              borderRadius: "12px",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {users.length > 0
              ? users.map((u) => u.name).join(" • ")
              : "Loading users..."}
          </div>
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <Toolbar
        color={brushColor}
        setColor={setBrushColor}
        width={brushWidth}
        setWidth={setBrushWidth}
        onClear={handleClearCanvas}
      />

      {/* Canvas Container with subtle frame */}
      <div
        style={{
          flex: 1,
          position: "relative",
          width: "100vw",
          height: "calc(100vh - 140px)",
          background: "#ffffff",
          margin: "8px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: `
            0 25px 60px rgba(0, 0, 0, 0.12),
            0 8px 25px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
          border: "1px solid rgba(255, 255, 255, 0.2)",
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

      <style>
        {`
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-3px) rotate(2deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
        `}
      </style>
    </div>
  );
}
