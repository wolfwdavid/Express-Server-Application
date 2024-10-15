app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();  // Fetch all posts from MongoDB
        res.render('index', { posts });   // Pass the posts array to the EJS template
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Server Error');
    }
});

app.post('/posts/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);  // Find the post by its ID
        if (!post) {
            return res.status(404).send('Post not found');
        }
        post.likes += 1;  // Increment the likes
        await post.save();  // Save the post
        res.redirect('/posts');  // Redirect back to the posts page
    } catch (error) {
        console.error('Error liking the post:', error);
        res.status(500).send('Server Error');
    }
});

app.post('/posts/:id/delete', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);  // Find and delete the post by its ID
        res.redirect('/posts');  // Redirect back to the posts page
    } catch (error) {
        console.error('Error deleting the post:', error);
        res.status(500).send('Server Error');
    }
});
