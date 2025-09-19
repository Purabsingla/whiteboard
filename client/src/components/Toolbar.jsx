import React from "react";

export default function Toolbar({ color, setColor, width, setWidth, onClear }) {
  const colors = [
    "#1a1a1a",
    "#ef4444",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        padding: "16px 24px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        minHeight: "64px",
      }}
    >
      {/* Color Palette Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(0, 0, 0, 0.02)",
          padding: "8px 16px",
          borderRadius: "16px",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <label
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#374151",
            minWidth: "45px",
          }}
        >
          Color:
        </label>
        <div style={{ display: "flex", gap: "6px" }}>
          {colors.map((clr) => (
            <button
              key={clr}
              onClick={() => setColor(clr)}
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: clr,
                border:
                  color === clr
                    ? "3px solid #6366f1"
                    : "2px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                  color === clr
                    ? `0 0 0 3px ${clr}20, 0 4px 12px rgba(0, 0, 0, 0.15)`
                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
                transform: color === clr ? "scale(1.1)" : "scale(1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {color === clr && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: clr === "#1a1a1a" ? "#fff" : "#fff",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brush Width Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(0, 0, 0, 0.02)",
          padding: "8px 16px",
          borderRadius: "16px",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <label
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#374151",
            minWidth: "45px",
          }}
        >
          Width:
        </label>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <input
            type="range"
            min="1"
            max="10"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            style={{
              width: "120px",
              height: "6px",
              borderRadius: "3px",
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${
                (width - 1) * 11.11
              }%, #e5e7eb ${(width - 1) * 11.11}%, #e5e7eb 100%)`,
              outline: "none",
              appearance: "none",
              cursor: "pointer",
            }}
          />
          <div
            style={{
              minWidth: "40px",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#6366f1",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              // color: "transparent",
            }}
          >
            {width}px
          </div>

          {/* Visual brush preview */}
          <div
            style={{
              width: `${Math.max(width * 2, 8)}px`,
              height: `${Math.max(width * 2, 8)}px`,
              borderRadius: "50%",
              backgroundColor: color,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              transition: "all 0.2s ease",
            }}
          />
        </div>
      </div>

      {/* Clear Canvas Button */}
      <button
        onClick={onClear}
        style={{
          padding: "10px 20px",
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
          minHeight: "44px",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-1px)";
          e.target.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
        }}
      >
        <span style={{ fontSize: "16px" }}>🗑️</span>
        Clear Canvas
      </button>

      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
            transition: all 0.15s ease;
          }
          
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
          }
        `}
      </style>
    </div>
  );
}
