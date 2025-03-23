const { boolean } = require('joi');
const mongoose = require('mongoose');



const GoogleSchema = new mongoose.Schema({
    username: {type:String, required : true},
    email: {type:String, required:true},
    image: {type:String},
    nickname: {type:String},
    user_verified: { type: Boolean, default: false },
    role: {type:String, required : true},
    userPost: { type: Array, default: [] },
});

// Convert Schema to Model
const GoogleUser = mongoose.model('Guser', GoogleSchema);

// Export the Model
module.exports = GoogleUser;