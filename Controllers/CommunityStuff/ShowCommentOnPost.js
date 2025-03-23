//showing all comment to a post
/**
 * 1.email not necessary
 * 2. postId complusary
 * 3. request Type Get
 */

const PostModel = require('../../Models/PostsSchema');
const UserModel = require('../../Models/UserSchema');

async function ShowCommentOnPost(req, res) {
    try {
        const { postId } = req.query;
        console.log("For comment showing, ID received:", postId);

        if (!postId) {
            return res.status(400).json({
                message: "Post ID is required.",
                success: false
            });
        }

        // Checking if post exists
        const isPostExist = await PostModel.findById(postId);
        if (!isPostExist) {
            return res.status(404).json({
                message: "Post does not exist. Refresh the page and try again.",
                success: false
            });
        }

        // Fetch all comments for that post
        const commentData = await Promise.all(
            isPostExist.postComments.map(async (comment) => {
                const user = await UserModel.findById(comment.userId).select("email");
                return {
                    comment: comment.commentBody,
                    email: user?.email || "Unknown", // Handle case if user not found
                    dateOfComment: comment.createdAt
                };
            })
        );

        return res.status(200).json({
            message: "All comments retrieved successfully!",
            success: true,
            comments: commentData
        });

    } catch (error) {
        console.error("Error in ShowCommentOnPost function:", error);
        return res.status(500).json({
            message: "Server-side error occurred.",
            success: false
        });
    }
}

module.exports = ShowCommentOnPost;
