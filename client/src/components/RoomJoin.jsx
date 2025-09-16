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
        backgroundColor: "#f8f9fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#333",
          }}
        >
          Collaborative Whiteboard
        </h1>

        <form onSubmit={joinRoom}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Your Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name (optional)"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Room Code:
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value.toUpperCase())}
              placeholder="Enter room code or leave blank to create new"
              maxLength={8}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                boxSizing: "border-box",
                textTransform: "uppercase",
              }}
            />
            <small
              style={{ color: "#666", marginTop: "0.25rem", display: "block" }}
            >
              6-8 alphanumeric characters
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Joining..." : room ? "Join Room" : "Create New Room"}
          </button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          <strong>How it works:</strong>
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
            <li>Enter your name and a room code to join existing room</li>
            <li>Leave room code blank to create a new room</li>
            <li>Share the room code with others to collaborate</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
