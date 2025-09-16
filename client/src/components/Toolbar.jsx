import React from "react";

export default function Toolbar({ color, setColor, width, setWidth, onClear }) {
  const colors = ["#000000", "#ff0000", "#0000ff", "#00ff00"];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Color Picker */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <label>Color:</label>
        {colors.map((clr) => (
          <button
            key={clr}
            onClick={() => setColor(clr)}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: clr,
              border: color === clr ? "3px solid #333" : "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Width Slider */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <label>Width:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          style={{ width: "100px" }}
        />
        <span>{width}px</span>
      </div>

      {/* Clear Button */}
      <button
        onClick={onClear}
        style={{
          padding: "8px 16px",
          backgroundColor: "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Clear Canvas
      </button>
    </div>
  );
}
