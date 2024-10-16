const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const jwtAuth = require('./middleware/jwtAuth');
const multer = require('multer');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

// Initialize app and server for socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myexpressapp')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Use Express's built-in body parser middleware
app.use(express.urlencoded({ extended: true })); // To handle form submissions
app.use(express.json()); // To handle JSON data

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Add your routes and other middlewares here

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
