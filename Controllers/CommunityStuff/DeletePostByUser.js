//only user own post can delete
/**
 * reuirement for delete user post by user
 * 1. user Email id
 * 2. post id and post id belongs to user (means those model where userId and PostId togther exists)
 */

const UserModel = require('../../Models/UserSchema');
const PostModel = require('../../Models/PostsSchema');  

async function DeletePostByUser(req, res) {
    try {
        const { PostId, email } = req.body; 
        if (!email || !PostId) {
            return res.status(400).json({
                message: "Missing required data (PostId or email).",
                success: false
            });
        }



        // Checking if user exists
        const isUserExists = await UserModel.findOne({ email });
        if (!isUserExists) {
            return res.status(401).json({
                message: "User does not exist or is not allowed.",
                success: false
            });
        }
        const UserId = isUserExists._id;



        // Checking if post exists
        const isPostExist = await PostModel.findById(PostId);
        if (!isPostExist) {
            return res.status(400).json({
                message: "Post is currently unavailable.",
                success: false
            });
        }



        // Checking if the post belongs to the user
        if (isPostExist.userId.toString() !== UserId.toString()) {
            return res.status(403).json({
                message: "Unauthorized: You cannot delete someone else's post.",
                success: false,
            });
        }



        // Delete the post
        const deleteResponse = await PostModel.findByIdAndDelete(PostId);
        if (!deleteResponse) {
            return res.status(500).json({
                message: "Failed to delete post.",
                success: false
            });
        }


        
        return res.status(200).json({
            message: "Post deleted successfully.",
            success: true,
        });

    } catch (error) {
        console.error("Error in DeletePostByUser function:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

module.exports = DeletePostByUser;
