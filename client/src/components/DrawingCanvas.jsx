import React, { useRef, useEffect } from "react";

export default function DrawingCanvas({ roomId, color, width, socket }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const pathRef = useRef([]);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let snapshot = null;

    const setSize = () => {
      if (!canvas) return;

      // Take snapshot BEFORE changing size
      if (canvas.width && canvas.height) {
        const off = document.createElement("canvas");
        off.width = canvas.width;
        off.height = canvas.height;
        off.getContext("2d").drawImage(canvas, 0, 0);
        snapshot = off;
      }

      const parent = canvas.parentElement;
      const newW = parent.clientWidth;
      const newH = parent.clientHeight;
      canvas.width = newW;
      canvas.height = newH;

      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.imageSmoothingEnabled = true;
      ctxRef.current = ctx;

      // Restore snapshot AFTER resize, scaling if necessary
      if (snapshot) {
        ctx.save();
        ctx.scale(newW / snapshot.width, newH / snapshot.height);
        ctx.drawImage(snapshot, 0, 0);
        ctx.restore();
      }
      socket.emit("request-canvas", { roomId });
    };

    // Debounced resize handler
    const onResize = () => {
      clearTimeout(window.__wb_rto);
      window.__wb_rto = setTimeout(setSize, 50);
    };

    window.addEventListener("resize", onResize);
    setSize();

    // Socket event handlers
    const handleDrawStart = ({ id, x, y, color: c, size }) => {
      if (id === socket.id) return;
      drawPoint(x, y, c, size);
    };

    const handleDrawMove = ({ id, x0, y0, x1, y1, color: c, size }) => {
      if (id === socket.id) return;
      drawLine(x0, y0, x1, y1, c, size);
    };

    const handleDrawEnd = ({ id, path, color: c, size }) => {
      if (id === socket.id) return;
      if (path && path.length > 1) {
        redrawPath(path, c, size);
      }
    };

    const handleClear = () => {
      clearCanvas();
    };

    const handleLoadCanvas = ({ drawingData }) => {
      console.log(
        "🎨 Loading canvas data:",
        drawingData?.length || 0,
        "strokes"
      );
      clearCanvas();
      if (drawingData && drawingData.length > 0) {
        drawingData.forEach(({ data }) => {
          if (data && data.path && data.path.length > 1) {
            redrawPath(data.path, data.color, data.size);
          }
        });
      }
    };

    socket.on("draw-start", handleDrawStart);
    socket.on("draw-move", handleDrawMove);
    socket.on("draw-end", handleDrawEnd);
    socket.on("clear-canvas", handleClear);
    socket.on("load-canvas", handleLoadCanvas);

    socket.emit("request-canvas", { roomId });

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(window.__wb_rto);
      socket.off("draw-start", handleDrawStart);
      socket.off("draw-move", handleDrawMove);
      socket.off("draw-end", handleDrawEnd);
      socket.off("clear-canvas", handleClear);
      socket.off("load-canvas", handleLoadCanvas);
    };
  }, [roomId, socket]);

  // Coordinate conversion
  const getCanvasCoords = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * canvasRef.current.width,
      y: ((clientY - rect.top) / rect.height) * canvasRef.current.height,
    };
  };

  const drawPoint = (x, y, strokeColor, strokeWidth) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, strokeWidth / 2, 0, 2 * Math.PI);
    ctx.fillStyle = strokeColor;
    ctx.fill();
  };

  const drawLine = (x0, y0, x1, y1, strokeColor, strokeWidth) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  };

  const redrawPath = (path, strokeColor, strokeWidth) => {
    const ctx = ctxRef.current;
    if (!ctx || !path || path.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  };

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    pathRef.current = [];

    const coords = getCanvasCoords(e.clientX, e.clientY);
    pathRef.current.push(coords);

    drawPoint(coords.x, coords.y, color, width);

    socket.emit("draw-start", {
      roomId,
      x: coords.x,
      y: coords.y,
      color,
      size: width,
    });
  };

  const handleMouseMove = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();

    const coords = getCanvasCoords(e.clientX, e.clientY);
    const lastPoint = pathRef.current[pathRef.current.length - 1];

    drawLine(lastPoint.x, lastPoint.y, coords.x, coords.y, color, width);

    socket.emit("draw-move", {
      roomId,
      x0: lastPoint.x,
      y0: lastPoint.y,
      x1: coords.x,
      y1: coords.y,
      color,
      size: width,
    });

    pathRef.current.push(coords);
  };

  const handleMouseUp = () => {
    if (!drawingRef.current) return;

    drawingRef.current = false;

    socket.emit("draw-end", {
      roomId,
      path: pathRef.current,
      color,
      size: width,
    });

    pathRef.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        display: "block",
        cursor: "crosshair",
        width: "100%",
        height: "100%",
        background: `
          linear-gradient(45deg, transparent 24%, rgba(255, 255, 255, 0.02) 25%, rgba(255, 255, 255, 0.02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.02) 75%, rgba(255, 255, 255, 0.02) 76%, transparent 77%, transparent),
          linear-gradient(45deg, transparent 24%, rgba(255, 255, 255, 0.02) 25%, rgba(255, 255, 255, 0.02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.02) 75%, rgba(255, 255, 255, 0.02) 76%, transparent 77%, transparent),
          #ffffff
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 10px 10px",
        transition: "all 0.2s ease",
      }}
    />
  );
}
