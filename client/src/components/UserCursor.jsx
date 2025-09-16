import React, { useEffect, useState } from "react";

export default function UserCursors({ roomId, users, socket }) {
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    let raf = null;
    let last = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      last = { x: e.clientX, y: e.clientY };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        socket.emit("cursor-move", { roomId, x: last.x, y: last.y });
        raf = null;
      });
    };

    const onCursor = ({ id, x, y }) => {
      // console.log("OnCursor works for ", id, x, y);
      if (id === socket.id) return; // don't render own cursor
      setCursors((prev) => ({ ...prev, [id]: { x, y, lastSeen: Date.now() } }));
    };

    document.addEventListener("mousemove", onMouseMove);
    socket.on("cursor-moving", onCursor);

    const cleanup = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const next = {};
        Object.entries(prev).forEach(([id, data]) => {
          if (now - data.lastSeen < 2500) next[id] = data;
        });
        return next;
      });
    }, 1000);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      socket.off("cursor-moving", onCursor);
      if (raf) cancelAnimationFrame(raf);
      clearInterval(cleanup);
    };
  }, [roomId, socket]);

  return (
    <>
      {Object.entries(cursors).map(([id, { x, y }]) => {
        const user = users.find((u) => u.id === id);
        // console.warn("Working you shitty ass bitch and user is ", users);
        if (!user) return null;
        const color = user.color || "#ff6b6b"; // fallback but should come from server
        return (
          <div
            key={id}
            style={{
              position: "fixed",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            {/* Cursor pointer */}
            <div
              style={{
                width: 0,
                height: 0,
                // borderLeft: `10px solid ${user.color || "#ff6b6b"}`,
                borderLeft: `10px solid ${color}`,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
              }}
            />
            {/* User name label */}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 0,
                transform: "translateX(-50%)",
                padding: "2px 6px",
                borderRadius: 4,
                background: color,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </div>
          </div>
        );
      })}
    </>
  );
}
