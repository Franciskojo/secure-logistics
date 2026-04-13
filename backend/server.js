import dotenv from "dotenv";
dotenv.config();
import app from './app.js';
import connectDB from './config/db.js';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      process.env.CLIENT_URL
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
  }
});

io.on('connection', (socket) => {
  console.log(`⚡ SECURELOGIX WEBSOCKET CONNECTED: [ID: ${socket.id}]`);
  
  socket.on('disconnect', () => {
    console.log(`❌ Websocket Disconnected: [ID: ${socket.id}]`);
  });
});

export { io };