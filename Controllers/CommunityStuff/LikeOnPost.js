/**
 * requirement for making like a post
 * 1. post id:- how to find the post id post has an post id
 * 2. email of liker body
 * 3. this should be Put request
 * 
 */
const UserModel = require('../../Models/UserSchema');
const PostModel = require('../../Models/PostsSchema');  


async function MakeLike(req, res) {
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



        // Adding UserId to the postLikes array in PostModel
        const UpdateLike = await PostModel.findByIdAndUpdate(
            PostId,
            { $addToSet: { postLikes: UserId } }, // Prevents duplicate likes
            { new: true }
        );

        return res.status(200).json({
            message: "You liked the post!",
            success: true,
            updatedPost: UpdateLike
        });

    } catch (error) {
        console.error("Error in MakeLike function:", error);
        return res.status(500).json({
            message: "Iserver ke L  lag Gaye.",
            success: false
        });
    }
}

module.exports = MakeLike;



//you can implement if use make like that the user id remove form dislike and via versa, --> apply in future