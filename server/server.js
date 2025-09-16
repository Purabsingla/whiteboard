import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuidV4 } from "uuid";
import mongoose from "mongoose";
import Room from "./models/room.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/whiteboard")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// FIXED: Generate unique colors for users
const generateUserColor = (socketId) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ];
  let hash = 0;
  for (let i = 0; i < socketId.length; i++) {
    hash = socketId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Helper to build normalized users list
const buildUsersList = (room) => {
  return Array.from(room.users.entries()).map(([id, userData]) => {
    if (typeof userData === "string") {
      return { id, name: userData, color: generateUserColor(id) };
    }
    return {
      id,
      name: userData?.name || "Anonymous",
      color: userData?.color || generateUserColor(id),
    };
  });
};

// Socket connection handling
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Join Room
  socket.on("join-room", async ({ roomId, username } = {}) => {
    try {
      console.warn("I think Works");
      if (!roomId) return;
      console.warn("I think, it actually Works");

      socket.join(roomId);
      let room = await Room.findOne({ roomId });

      if (!room) {
        room = new Room({ roomId });
      }

      if (!room.users) {
        room.users = new Map();
      }
      const userColor = generateUserColor(socket.id);
      room.users.set(socket.id, {
        name: username || "Anonymous",
        color: userColor,
      });
      room.lastActivity = new Date();
      console.log("Before saving story of socket");
      await room.save();

      // Build normalized users list
      const usersList = buildUsersList(room);
      console.log("After some time USERS");
      console.log(usersList, " and length is ", usersList?.length);
      // Notify ALL users with updated user list
      io.to(roomId).emit("room-users", {
        users: usersList,
        count: usersList.length,
      });

      // Send existing canvas data to newly joined user
      socket.emit("load-canvas", {
        drawingData: room.drawingData || [],
      });

      console.log(
        `${socket.id} joined ${roomId} as ${username || "Anonymous"} (${
          usersList.length
        } total users)`
      );
    } catch (err) {
      console.error("Error joining room:", err);
    }
  });

  // Request canvas data
  socket.on("request-canvas", async ({ roomId }) => {
    try {
      if (!roomId) return;
      const room = await Room.findOne({ roomId });
      if (room) {
        socket.emit("load-canvas", {
          drawingData: room.drawingData || [],
        });
      }
    } catch (err) {
      console.error("Error loading canvas:", err);
    }
  });

  // Drawing Events
  socket.on("draw-start", ({ roomId, x, y, color, size }) => {
    if (!roomId) return;
    socket.to(roomId).emit("draw-start", { id: socket.id, x, y, color, size });
  });

  socket.on("draw-move", ({ roomId, x0, y0, x1, y1, color, size }) => {
    if (!roomId) return;
    socket.to(roomId).emit("draw-move", {
      id: socket.id,
      x0,
      y0,
      x1,
      y1,
      color,
      size,
    });
  });

  socket.on(
    "draw-end",
    async ({ roomId, path = [], color = "#000", size = 2 }) => {
      try {
        if (!roomId) return;

        socket
          .to(roomId)
          .emit("draw-end", { id: socket.id, path, color, size });

        let room = await Room.findOne({ roomId });
        if (!room) return;

        room.drawingData.push({
          id: socket.id,
          type: "stroke",
          data: { path, color, size },
          timestamp: new Date(),
        });

        if (room.drawingData.length > 5000) room.drawingData.shift();
        room.lastActivity = new Date();
        await room.save();
      } catch (err) {
        console.error("❌ Failed to save stroke:", err);
      }
    }
  );

  // FIXED: Cursor tracking with cursor-move event
  socket.on("cursor-move", ({ roomId, x, y } = {}) => {
    if (!roomId) return;
    // console.log(socket.id, x, y, " person comes");
    socket.to(roomId).emit("cursor-moving", { id: socket.id, x, y });
  });

  // Clear Canvas
  socket.on("clear-canvas", async ({ roomId } = {}) => {
    try {
      if (!roomId) return;

      const room = await Room.findOne({ roomId });
      if (room) {
        room.drawingData = [];
        room.lastActivity = new Date();
        await room.save();
      }

      io.to(roomId).emit("clear-canvas");
      console.log(`Canvas cleared in room ${roomId} by ${socket.id}`);
    } catch (err) {
      console.error("Error clearing canvas:", err);
    }
  });

  // Leave Room
  socket.on("leave-room", async ({ roomId }) => {
    try {
      if (!roomId) return;

      const room = await Room.findOne({ roomId });
      if (room) {
        room.users.delete(socket.id);
        await room.save();

        const usersList = buildUsersList(room);
        io.to(roomId).emit("room-users", {
          users: usersList,
          count: usersList.length,
        });
      }

      socket.leave(roomId);
      console.log(`${socket.id} left room ${roomId}`);
    } catch (err) {
      console.error("Error leaving room:", err);
    }
  });

  // Disconnect
  // socket.on("disconnect", async () => {
  //   console.log("Socket disconnected:", socket.id);
  //   const rooms = await Room.find({});
  //   console.log(rooms);
  //   console.log(socket.id);
  //   for (const room of rooms) {
  //     if (room.users.has(socket.id)) {
  //       room.users.delete(socket.id);
  //       await room.save();

  //       const usersList = buildUsersList(room);
  //       io.to(room.roomId).emit("room-users", {
  //         users: usersList,
  //         count: usersList.length,
  //       });
  //     }
  //   }
  // });
  socket.on("disconnect", async () => {
    console.log("Socket disconnected:", socket.id);

    const rooms = await Room.find({});
    for (const room of rooms) {
      // defensive check in case some old docs don’t have users
      if (room.users && room.users.has(socket.id)) {
        console.warn("Success");
        room.users.delete(socket.id);
        await room.save();

        const usersList = buildUsersList(room);
        io.to(room.roomId).emit("room-users", {
          users: usersList,
          count: usersList.length,
        });
      }
    }
  });
});

// REST Endpoints
app.post("/api/rooms/join", async (req, res) => {
  try {
    const { roomId, username } = req.body;
    const id = roomId || uuidV4().slice(0, 8).toUpperCase();

    let room = await Room.findOne({ roomId: id });
    if (!room) {
      room = new Room({ roomId: id });
      await room.save();
    }

    res.json({
      roomId: id,
      users: room.users ? buildUsersList(room) : [],
    });
  } catch (err) {
    console.error("Error joining room via API:", err);
    res.status(500).json({ error: "Failed to join room" });
  }
});

app.get("/api/rooms/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) return res.status(404).json({ error: "Room not found" });

    res.json({
      users: buildUsersList(room),
      drawingData: room.drawingData,
    });
  } catch (err) {
    console.error("Error getting room info:", err);
    res.status(500).json({ error: "Failed to get room info" });
  }
});

server.listen(5000, () => {
  console.log("🚀 Server is running on port 5000");
});
