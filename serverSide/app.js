import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = 4000;

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  // React app URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send('Chat server is running!');
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Listen for incoming chat messages
    socket.on('send_message', (data) => {
        console.log(`Message from ${socket.id}: ${data.message}`);
        
        // Broadcast message to all connected clients
        io.emit('receive_message', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
