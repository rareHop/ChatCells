import { Server } from 'socket.io';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const messages = new Set();

io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send existing messages to new client
  messages.forEach(message => {
    socket.emit('message', message);
  });

  socket.on('message', (message) => {
    messages.add(message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (res.socket?.server?.io) {
    res.end();
    return;
  }

  io.attach(res.socket?.server);
  res.socket.server.io = io;

  res.end();
}