const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Post = require('./models/Post');  // Assuming the Post model is in models/Post.js

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myexpressapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to display all posts
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.render('index', { posts });
    } catch (err) {
        res.status(500).send('Error fetching posts: ' + err.message);
    }
});

// Route to create a new post
app.post('/posts', async (req, res) => {
    const { title, content, imageUrl } = req.body;

    if (!title || !content) {
        return res.status(400).send('Title and content are required!');
    }

    const newPost = new Post({
        title,
        content,
        likes: 0,
        imageUrl: imageUrl || null
    });

    try {
        await newPost.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error saving post: ' + err.message);
    }
});

// Route to delete a post by its ID
app.post('/posts/:id/delete', async (req, res) => {
    try {
        const postId = req.params.id;
        await Post.findByIdAndDelete(postId);  // Find and delete the post by its ID
        res.redirect('/');  // Redirect back to the homepage after deletion
    } catch (err) {
        res.status(500).send('Error deleting post: ' + err.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
