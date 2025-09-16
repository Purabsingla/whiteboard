import mongoose from "mongoose";

const DrawingCommandSchema = new mongoose.Schema({
  type: { type: String, enum: ["stroke", "clear"], required: true },
  data: { type: Object, required: true }, // path, color, width, etc.
  timestamp: { type: Date, default: Date.now },
});

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  users: {
    type: Map,
    of: new mongoose.Schema(
      {
        name: String,
        color: String,
      },
      { _id: false } // prevent subdocument _id
    ),
    default: {},
  },
  drawingData: [DrawingCommandSchema],
});
RoomSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 86400 });
export default mongoose.model("Room", RoomSchema);
