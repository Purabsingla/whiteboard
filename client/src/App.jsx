import React, { useState } from "react";
import RoomJoin from "./components/RoomJoin.jsx";
import Whiteboard from "./components/Whiteboard.jsx";

export default function App() {
  const [roomId, setRoomId] = useState(null);
  const [username, setUsername] = useState(null);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      {!roomId ? (
        <RoomJoin setRoomId={setRoomId} setUsername={setUsername} />
      ) : (
        <Whiteboard roomId={roomId} username={username} />
      )}
    </div>
  );
}
