const express = require('express');
const Post = require('../models/Post');
const jwtAuth = require('../middleware/jwtAuth');
const multer = require('multer');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Backticks here to create a template literal
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const router = express.Router();

// Render posts page
router.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('index', { posts });
});

// Render new post form
router.get('/new', (req, res) => {
    res.render('new');
});

// Create a new post (*protected route with image upload*)
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
