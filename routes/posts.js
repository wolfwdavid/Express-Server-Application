const express = require('express');
const Post = require('../models/Post');
const jwtAuth = require('../middleware/jwtAuth');
const multer = require('multer');  // <-- Add this line to import multer

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });  // <-- Define the upload middleware here

const router = express.Router();

// Render the posts page
router.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('index', { posts });
});

// Render the new post form
router.get('/new', (req, res) => {
    res.render('new');
});

// Create a new post (protected route with image upload)
router.post('/', jwtAuth, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const newPost = new Post({
        title,
        content,
        imageUrl,
        user: req.user
    });

    await newPost.save();
    res.redirect('/posts');
});

module.exports = router;
