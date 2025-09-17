# 🖊️ Collaborative Whiteboard  

A **real-time collaborative whiteboard application** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and **Socket.io** for live collaboration.  
This project allows multiple users to join a room and collaborate on a shared canvas with live drawing and cursor tracking.  

---

## 🚀 Features  

- **Room Management**
  - Join/Create rooms with simple alphanumeric codes (6–8 characters)  
  - No authentication required  
  - Active user count in each room  

- **Drawing Tools**
  - Pencil/Pen tool with smooth lines  
  - Adjustable stroke width (slider)  
  - Color selection (Black, Red, Blue, Green)  
  - Clear canvas option  

- **Real-time Collaboration**
  - Instant drawing sync across all users  
  - Real-time cursor tracking with unique colors  
  - Presence indicators (active user count + cursors)  

- **Performance Optimizations**
  - Throttled cursor updates (~60fps)  
  - Incremental drawing updates (not full canvas)  
  - Auto-clean inactive rooms after 24 hours  

---

## 🛠️ Tech Stack  

- **Frontend:** React.js + CSS/Styled Components  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Real-time:** Socket.io  
- **Deployment:** Vercel (Client) + Render (Server)  

---

## 📂 Project Structure 
```structure
project-root/
├── client/ # React frontend
│ ├── src/
│ │ ├── App.js
│ │ ├── components/
│ │ │ ├── RoomJoin.js
│ │ │ ├── Whiteboard.js
│ │ │ ├── DrawingCanvas.js
│ │ │ ├── Toolbar.js
│ │ │ └── UserCursors.js
│ ├── public/
│ └── package.json
│
├── server/ # Node.js backend
│ ├── models/
│ │ └── Room.js
│ ├── routes/
│ ├── socket/
│ └── server.js
│
├── README.md
└── package.json
```

---

## ⚡ Socket Events  

| Event          | Description |
|----------------|-------------|
| `join-room`    | User joins room |
| `leave-room`   | User leaves room |
| `cursor-move`  | Cursor position updates |
| `draw-start`   | Begin drawing stroke |
| `draw-move`    | Send stroke path data |
| `draw-end`     | End drawing stroke |
| `clear-canvas` | Clear the entire canvas |

---

## 🗄️ Database Schema  

### Room Schema  
```javascript
{
  roomId: String (unique),
  createdAt: Date,
  lastActivity: Date,
  drawingData: Array // Stores drawing commands
}
```

### Drawing Command Schema
```javascript
{
  type: String, // 'stroke' or 'clear'
  data: Object, // path, color, width, etc.
  timestamp: Date
}
```
## Setup Instructions  

### 1. Clone Repository  
```bash
git clone https://github.com/your-username/collaborative-whiteboard.git
cd collaborative-whiteboard
```

### 2. Install Dependencies
  ####Client
```bash
cd client
npm install
```

  ####Server
  ```bash
cd Server
npm install
```

### 3. Configure Environment Variables
```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Run Locally  
```bash
cd client
npm run dev
cd server
npm run dev //Nodemon
```
## Deployment

- Client (React) → Vercel
- Server (Express + Socket.io) → Render


 

