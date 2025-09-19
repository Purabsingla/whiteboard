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
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
              animation: "cursorPulse 2s infinite ease-in-out",
            }}
          >
            {/* Glowing ring effect */}
            <div
              style={{
                position: "absolute",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color}40, transparent 70%)`,
                animation: "ripple 1.5s infinite ease-out",
                top: "-2px",
                left: "-2px",
              }}
            />

            {/* Cursor pointer with gradient and glow */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `12px solid ${color}`,
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                filter: `drop-shadow(0 0 8px ${color}60) drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
                position: "relative",
                zIndex: 2,
              }}
            />

            {/* User name label with glassmorphism */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 2,
                transform: "translateX(-20%)",
                padding: "4px 8px",
                borderRadius: 8,
                background: `linear-gradient(135deg, ${color}E6, ${color}CC)`,
                backdropFilter: "blur(10px)",
                border: `1px solid ${color}40`,
                color: "#fff",
                fontSize: 10,
                fontWeight: 600,
                whiteSpace: "nowrap",
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: "0.02em",
                boxShadow: `0 4px 20px ${color}40, 0 1px 3px rgba(0,0,0,0.2)`,
                animation: "fadeInUp 0.3s ease-out",
              }}
            >
              {user.name}
            </div>
          </div>
        );
      })}

      <style>
        {`
          @keyframes cursorPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.05); }
          }
          
          @keyframes ripple {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateX(-20%) translateY(5px); }
            to { opacity: 1; transform: translateX(-20%) translateY(0); }
          }
        `}
      </style>
    </>
  );
}
