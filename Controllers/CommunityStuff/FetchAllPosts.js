//get all post with pagination

const PostModel = require('../../Models/PostsSchema')

async function FetchAllPosts(req, res) {
    try {

        //your api call url will be :- base-url/get/all-posts?limit=10&cursor=null
        const { limit = 10, cursor } = req.query;
        console.log("details for fetching post", req.query);

        let query = {};
        if (cursor) {
            query = { createAt: { $lt: new Date(cursor) } };
        }

        const posts = await PostModel.find(query)
            .sort({ createdAt: -1 })//Newest First (descending order)
            .limit(parseInt(limit));
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt : null;

        return res.status(200).json({ posts, nextCursor });
    } catch (error) {
        console.log("error while fetching post",error);
        return res.status(500).json({
            message : "server side error while fetching post",
            success : false
        })
    }
}

module.exports = FetchAllPosts;