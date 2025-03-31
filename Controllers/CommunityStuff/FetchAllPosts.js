const PostModel = require('../../Models/PostsSchema');

async function FetchAllPosts(req, res) {
    try {
        let { limit = 10, cursor } = req.query;
        limit = parseInt(limit); // Ensure limit is a valid number

        console.log("Fetching posts with:", req.query);

        let query = {};
        if (cursor) {
            const cursorDate = new Date(cursor);
            if (!isNaN(cursorDate.getTime())) {
                query = { createdAt: { $lt: cursorDate } }; // Filter posts older than cursor
            } else {
                return res.status(400).json({ success: false, message: "Invalid cursor format" });
            }
        }

        const posts = await PostModel.find(query)
            .sort({ createdAt: 1 }) // Sort by newest first
            .limit(limit);

        const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt.toISOString() : null;

        return res.status(200).json({ success: true, posts: posts || [], nextCursor });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

module.exports = FetchAllPosts;