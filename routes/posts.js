const express = require('express');
const Post = require('../models/Post');
const multer = require('multer');
const jwtAuth = require('../middleware/jwtAuth');
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

// Create a new post (protected route)
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

// Like a post (socket.io)
router.post('/:id/like', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post) {
        post.likes += 1;
        await post.save();
        res.redirect('/posts');
    } else {
        res.status(404).send('Post not found');
    }
});

// Delete a post (protected)
router.post('/:id/delete', jwtAuth, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/posts');
});

module.exports = router;
