const express = require('express');
const bodyParser = require('body-parser');
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
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));

// Socket.io for real-time updates
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('likePost', (postId) => {
        io.emit('postLiked', postId);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Root route ("/")
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});
