import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const isValidRoom = (s) => /^[A-Za-z0-9]{6,8}$/.test(s);

export default function RoomJoin({ setRoomId, setUsername }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);

  const joinRoom = async (e) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const roomCode = room?.trim() ? room.trim() : uuidv4().slice(0, 8);

      if (room && !isValidRoom(roomCode)) {
        alert(
          "Room code must be 6-8 alphanumeric characters (or leave blank to create)."
        );
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "https://whiteboard-d7uj.onrender.com/api/rooms/join",
        {
          roomId: roomCode,
          username: name || "Anonymous",
        }
      );

      // API should return { roomId }
      setRoomId(res.data.roomId || roomCode);
      setUsername(name || "Anonymous");
    } catch (err) {
      console.error("Join failed", err);
      alert("Failed to join room. Backend must be running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        minWidth: "99vw",

        background: `
          linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%),
          radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
        `,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
          animation: "float1 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
          animation: "float2 8s ease-in-out infinite",
        }}
      />

      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          padding: "3rem",
          borderRadius: "24px",
          boxShadow: `
            0 32px 64px rgba(0, 0, 0, 0.12),
            0 16px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
          width: "100%",
          maxWidth: "440px",
          marginTop: "100px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          animation: "slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header with animated logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              margin: "0 auto 20px",
              boxShadow: "0 12px 32px rgba(102, 126, 234, 0.3)",
              animation: "logoSpin 3s ease-in-out infinite",
            }}
          >
            🎨
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            Whiteboard Live
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            Where creativity meets collaboration
          </p>
        </div>

        <form onSubmit={joinRoom}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#334155",
                fontSize: "0.95rem",
              }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your creative alias..."
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "1rem",
                boxSizing: "border-box",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                outline: "none",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                e.target.style.background = "rgba(255, 255, 255, 1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
                e.target.style.background = "rgba(255, 255, 255, 0.8)";
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#334155",
                fontSize: "0.95rem",
              }}
            >
              Room Code
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value.toUpperCase())}
              placeholder="Leave blank to create new room..."
              maxLength={8}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "1rem",
                boxSizing: "border-box",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: "600",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                outline: "none",
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                e.target.style.background = "rgba(255, 255, 255, 1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
                e.target.style.background = "rgba(255, 255, 255, 0.8)";
              }}
            />
            <small
              style={{
                color: "#64748b",
                marginTop: "6px",
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              6-8 alphanumeric characters
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: loading
                ? "linear-gradient(135deg, #cbd5e1, #94a3b8)"
                : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: loading
                ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                : "0 8px 25px rgba(102, 126, 234, 0.3)",
              position: "relative",
              overflow: "hidden",
              minHeight: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 12px 35px rgba(102, 126, 234, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 8px 25px rgba(102, 126, 234, 0.3)";
              }
            }}
          >
            {loading && (
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            )}
            {loading ? (
              "Joining..."
            ) : (
              <>
                <span style={{ fontSize: "18px" }}>🚀</span>
                {room ? "Join Room" : "Create New Room"}
              </>
            )}
          </button>
        </form>

        {/* Feature highlight */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background:
              "linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))",
            borderRadius: "16px",
            border: "1px solid rgba(102, 126, 234, 0.1)",
            fontSize: "0.9rem",
            color: "#475569",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "20px" }}>✨</span>
            <strong style={{ color: "#334155" }}>
              Real-time Collaboration
            </strong>
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", lineHeight: 1.6 }}>
            <li>See cursors and drawings in real-time</li>
            <li>Share room codes with your team</li>
            <li>Perfect for brainstorming sessions</li>
          </ul>
        </div>
      </div>

      <style>
        {`
          @keyframes slideInUp {
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes logoSpin {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(5deg) scale(1.05); }
          }
          
          @keyframes float1 {
            0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(2deg); }
            66% { transform: translate(-20px, 20px) rotate(-1deg); }
          }
          
          @keyframes float2 {
            0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
            33% { transform: translate(-25px, -20px) rotate(-1deg); }
            66% { transform: translate(25px, 15px) rotate(1deg); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
