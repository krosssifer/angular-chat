const { Server } = require('socket.io');

const io = new Server(3000, {
  cors: {
    origin: ["http://localhost:4200", "http://localhost:4201"],
    methods: ["GET", "POST"]
  }
});

let messageHistory = [];
let connections = new Set();

io.on('error', (error) => {
  console.error('Socket.IO server error:', error);
});

io.on('connection', (socket) => {
  console.log('Client connected');
  connections.add(socket);
  socket.emit('message history', messageHistory);
  socket.on('chat message', (message) => {
    try {
      messageHistory.push(message);
      if (messageHistory.length > 100) {
        messageHistory = messageHistory.slice(-100);
      }
      socket.broadcast.emit('chat message', message);
    } catch (error) {
      console.error('Error handling chat message:', error);
      socket.emit('error', { message: 'Failed to process message' });
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    connections.delete(socket);
  });
});
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
function shutdown() {
  console.log('Shutting down server...');

  for (const socket of connections) {
    socket.disconnect(true);
  }
  
 
  io.close(() => {
    console.log('Server shut down complete');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

console.log('WebSocket server running on port 3000');