const PostModel = require("../../Models/PostsSchema");

async function FetchAllPosts(req, res) {
    try {
        let { limit = 10, cursor } = req.query;
        limit = parseInt(limit); // Convert limit to number

        console.log("Fetching posts with:", req.query);

        let query = {};
        if (cursor) {
            const cursorDate = new Date(cursor);
            if (!isNaN(cursorDate.getTime())) {
                query = { createdAt: { $lt: cursorDate } }; // Fetch older posts
            } else {
                return res.status(400).json({ success: false, message: "Invalid cursor format" });
            }
        }

        // Fetch posts sorted by `createdAt` (latest first)
        const posts = await PostModel.find(query)
            .sort({ createdAt: -1 }) // Fetch latest posts first
            .limit(limit)
            .lean(); // Convert Mongoose documents to plain JSON for better performance

        // Generate `nextCursor` if there are more posts
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt.toISOString() : null;

        return res.status(200).json({ success: true, posts, nextCursor });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

module.exports = FetchAllPosts;
