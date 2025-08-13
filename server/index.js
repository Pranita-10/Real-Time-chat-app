const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3002;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for 'chat message' events from clients
    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });

    // Listen for 'disconnect' events
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});