const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        email : {type : String,required:true},
        postBody: { type: String, trim: true },
        postImg: { type: String, trim: true },

        postLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        postDisLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        postComments: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                commentBody: { type: String, required: true, trim: true },
                createdAt: { type: Date, default: Date.now }
            }
        ],

        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true } // Enables createdAt and updatedAt automatically
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
