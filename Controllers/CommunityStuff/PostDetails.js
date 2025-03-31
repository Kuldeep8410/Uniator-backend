const UserModel = require('../../Models/UserSchema');
const PostModel = require('../../Models/PostsSchema');

async function PostDetails (req,res){
    try {
        const {email, _id} = req.query
        console.log("query", req.query);

        if(!email || !_id){
            return res.status(400).json({
                message : "failed",
                success : false
            })
        }

        const userExist = await UserModel.find({email : email});
        if(!userExist){
            return res.status(401).json({
                message : "login first",
                success : false
            })
        }

        const post = await PostModel.findById({_id : _id});
        console.log(post)
        return res.status(200).json({
            message : "okk",
            success : true,
            post : post
        })
    } catch (error) {
        console.log("error in PostDetails",error);
        return res.status(500).json({
            message : "failed to load",
            success : false
        })
    }
}
module.exports = PostDetails