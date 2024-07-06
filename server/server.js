const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;

app.use(cors());

const rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createRoom', (callback) => {
    const roomId = Math.random().toString(36).substring(2, 9);
    rooms[roomId] = { users: [] };
    callback(roomId);
  });

  socket.on('joinRoom', (roomId, callback) => {
    if (rooms[roomId]) {
      rooms[roomId].users.push(socket.id);
      socket.join(roomId);
      callback(true);
      io.to(roomId).emit('message', 'A new user has joined the room');
    } else {
      callback(false);
    }
  });

  socket.on('sendMessage', (roomId, message) => {
    if (rooms[roomId]) {
      io.to(roomId).emit('message', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    for (const roomId in rooms) {
      const users = rooms[roomId].users;
      const index = users.indexOf(socket.id);
      if (index !== -1) {
        users.splice(index, 1);
        io.to(roomId).emit('message', 'A user has left the room');
        if (users.length === 0) {
          delete rooms[roomId];
        }
        break;
      }
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
