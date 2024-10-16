const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const Post = require('./models/Post');  //  model defined in models/Post.js (Working)

// Initialize app and server for socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB (Error fixed)
mongoose.connect('mongodb://localhost:27017/myexpressapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Use Express's built-in body parser middleware
app.use(express.urlencoded({ extended: true })); // Handle form submissions
app.use(express.json()); // To handle JSON data

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the form for creating a new post
app.get('/posts/new', (req, res) => {
    res.render('new');  // Render the new.ejs form for creating posts
});

// Route to handle form submission and create a new post
app.post('/posts', async (req, res) => {
    const { title, content, imageUrl } = req.body;

    // Check if both title and content are provided
    if (!title || !content) {
        return res.status(400).send('Title and content are required!');
    }

    // Create a new post with the provided data
    const newPost = new Post({
        title,
        content,
        likes: 0,
        imageUrl: imageUrl || null  // Optional imageUrl
    });

    try {
        // Save the new post to MongoDB
        await newPost.save();
        res.redirect('/');  // Redirect to the home page after creation
    } catch (err) {
        res.status(500).send('Error saving post: ' + err.message);
    }
});

// Route to display all posts
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find();  // Fetch all posts from MongoDB
        res.render('index', { posts });  // Render the index.ejs template and pass the posts
    } catch (err) {
        res.status(500).send('Error fetching posts: ' + err.message);
    }
});

// Route to handle "liking" a post
app.post('/posts/:id/like', async (req, res) => {
    try {
        const postId = req.params.id;
        // Find the post by its ID and increment the "likes" field
        const post = await Post.findById(postId);
        
        if (post) {
            post.likes += 1;  // Increment likes
            await post.save();  // Save the updated post back to the database
        }
        
        res.redirect('/');  // Redirect back to the homepage after liking the post
    } catch (err) {
        res.status(500).send('Error liking post: ' + err.message);
    }
});

// Route to delete a post by its ID
app.post('/posts/:id/delete', async (req, res) => {
    try {
        const postId = req.params.id;
        await Post.findByIdAndDelete(postId);  // Find post by ID and delete it
        res.redirect('/');  // Redirect back to the homepage after deletion (pending)
    } catch (err) {
        res.status(500).send('Error deleting post: ' + err.message);
    }
});

// Server Start
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
