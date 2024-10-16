const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    imageUrl: { type: String, default: null }
});

module.exports = mongoose.model('Post', postSchema);
