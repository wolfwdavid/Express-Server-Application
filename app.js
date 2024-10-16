const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Post = require('./models/Post');  // Import the Post model

// Initialize the Express app
const app = express();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myexpressapp')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Use Express's built-in body parser middleware to handle form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the form for creating a new post
app.get('/posts/new', (req, res) => {
    res.render('new');  // Render the new.ejs form to create a new post
});

// ***** PASTE THE POST ROUTE HERE *****
app.post('/posts', async (req, res) => {
    console.log(req.body);  // Check if imageUrl is coming through correctly

    const { title, content, imageUrl } = req.body;

    // Validation: Ensure both title and content are provided
    if (!title || !content) {
        return res.status(400).send('Title and content are required!');
    }

    // Create a new post object with the provided data
    const newPost = new Post({
        title,            // Title of the post
        content,          // Content of the post
        likes: 0,         // Initialize likes to 0
        imageUrl: imageUrl || null  // Optional imageUrl, default to null if not provided
    });

    try {
        // Attempt to save the new post to MongoDB
        await newPost.save();
        
        // Redirect the user to the homepage after the post is successfully saved
        res.redirect('/');
    } catch (err) {
        // If there's an error during save, send a 500 status and log the error message
        res.status(500).send('Error saving post: ' + err.message);
    }
});

// Route to display all posts on the homepage
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find();  // Fetch all posts from MongoDB
        res.render('index', { posts });  // Render the index.ejs template with the posts
    } catch (err) {
        res.status(500).send('Error fetching posts: ' + err.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
