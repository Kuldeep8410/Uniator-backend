const UserModel = require('../../Models/UserSchema');
const PostModel = require('../../Models/PostsSchema');

async function RetriveAllPosts(req, res) {
    try {
        const { email } = req.query;
        console.log("User fetching all posts:", req.query);

        if (!email) {
            return res.status(400).json({
                message: "Ha Ji, Kaha? Kuhh Data toh Bhejiye!",
                success: false
            });
        }


        // Check if user exists
        const Isuser = await UserModel.findOne({ email }).select("_id");
        if (!Isuser) {
            return res.status(401).json({
                message: "Ha ji, Kaha? Apka Khata Yaha nahi hai!",
                success: false
            });
        }


        // Retrieve all posts
        const PostData = await PostModel.find().select("userId postBody postImg postLikes postDisLikes postComments createdAt");
        if (PostData.length === 0) {
            return res.status(404).json({
                message: "Koi Posts Nahi Milay Bhai!",
                success: false
            });
        }



        // Constructing response data
        const arrayOfPostData = await Promise.all(
            PostData.map(async (post) => {
                const student = await UserModel.findById(post.userId).select("email");

                return {
                    postId : post._id,
                    email: student?.email || "Unknown",
                    postBody: post.postBody,
                    postImg: post.postImg || null,
                    LikeCount: post.postLikes.length || 0,
                    DislikeCount: post.postDisLikes.length || 0,
                    CommentCount: post.postComments.length || 0,
                    createdAt: post.createdAt
                };
            })
        );

        return res.status(200).json({
            message: "Apka Data Fetch Hua Successfully! ",
            success: true,
            data: arrayOfPostData
        });

    } catch (error) {
        console.error("Server Side Error:", error);
        return res.status(500).json({
            message: "Server Phat Gaya Saayad!",
            success: false
        });
    }
}

module.exports = RetriveAllPosts;
