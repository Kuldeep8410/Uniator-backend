/**
 * Making Comment On post 
 *  # requirement for Making a commnet on Post
 * 1. user Email id --> for finding useriD
 * 2. Comment Body 
 * 3. post Id :-> for knowning on which post user make commnets
 * 
 * 
 */

const UserModel = require('../../Models/UserSchema');
const PostModel = require('../../Models/PostsSchema');

async function MakeCommentToPost(req, res) {
    try {
        const { email, commentBody, postId } = req.body;
        console.log("Received comment request:", req.body);

        if (!email || !commentBody || !postId) {
            return res.status(400).json({
                message: "Missing data: email, commentBody, or postId.",
                success: false
            });
        }

        // Check if user exists
        const isUserExists = await UserModel.findOne({ email });
        if (!isUserExists) {
            return res.status(401).json({
                message: "Unauthorized! User does not exist.",
                success: false
            });
        }
        const UserId = isUserExists._id;

        // Check if post exists
        const isPostExist = await PostModel.findById(postId);
        if (!isPostExist) {
            return res.status(400).json({
                message: "Post does not exist. Refresh and try again.",
                success: false
            });
        }

        // Add comment to postComments array
        const updateCommentArray = await PostModel.findByIdAndUpdate(
            postId,
            { 
                $push: { 
                    postComments: { 
                        userId: UserId, 
                        commentBody: commentBody, 
                        createdAt: Date.now() 
                    } 
                } 
            },
            { upsert: true, new: true }
        );

        if (!updateCommentArray) {
            return res.status(500).json({
                message: "Error while adding your comment.",
                success: false
            });
        }

        // If comment is successfully added
        return res.status(200).json({
            message: "Nice! You made a comment. Refresh to see the changes.",
            success: true
        });

    } catch (error) {
        console.error("Error in MakeCommentToPost:", error);
        return res.status(500).json({
            message: "Server-side error occurred.",
            success: false
        });
    }
}

module.exports = MakeCommentToPost;
