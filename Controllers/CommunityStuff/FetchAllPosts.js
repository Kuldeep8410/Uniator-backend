const PostModel = require('../../Models/PostsSchema')

async function FetchAllPosts(req, res) {
    try {
        const { limit = 10, cursor } = req.query;
        console.log("Fetching posts with:", req.query);

        let query = {};
        if (cursor) {
            query = { createdAt: { $lt: new Date(cursor) } }; // Use "createdAt" instead of "createAt"
        }

        const posts = await PostModel.find(query)
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(parseInt(limit));

        const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt.toISOString() : null;

        return res.status(200).json({ posts, nextCursor });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

module.exports = FetchAllPosts;
