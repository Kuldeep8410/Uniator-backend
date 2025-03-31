/**
 * requirement for making post
 * 1. Post body
 * 2. post image if any
 * 3. user email,
 * 4. user
 * 
 * //post request hoga
 */
const UserModel = require('../../Models/UserSchema')
const PostModel = require('../../Models/PostsSchema')


async function MakePost(req, res) {
    try {
        const { email,url, title, body } = req.body;
        console.log(req.body)

        if (!email || !body || !title) {
            return res.status(400).json({
                message: "Data Sahi Se Nahi Aa rha bhai",
                success: false
            })
        }



        //checking user exist or not  
        const isUserExists = await UserModel.findOne({ email: email }).select("_id");
        if (!isUserExists) {
            return res.status(200).json({
                message: "Kya bhai aaka Account Nahi hai !!",
                success: false
            })
        }

        const UserId = isUserExists._id;



        //adding user post to PostModel
        const SaveToPostModel = new PostModel({
            userId: UserId,
            title : title,
            postBody: body,
            postImg : url || null,
            createdAt: new Date().setHours(0, 0, 0, 0),
            email: email
        });

        await SaveToPostModel.save();

        return res.status(200).json({
            message : "Chaliye maharaj Apka Post Accept hua",
            success : true
        })



    } catch (error) {
        console.log("error occur in Make Post Ctrl", error);
        return res.status(500).json({
            message : "Server Phat Gaya Ismein Meri Koi galti Nahi Hai Ji",
            success : false
        })

    }
}

module.exports = MakePost;