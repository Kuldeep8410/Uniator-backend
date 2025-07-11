const mongoose = require('mongoose');

// Define Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },

    userPost: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    currentTask: { type: Array, default: [] },
    completedTask: { type: Array, default: [] },

    description: { type: String },
    location: { type: String },
    github: { type: String },
    linkedin: { type: String }, // removed duplicate 'linked'
    
    skills: { type: [String], default: [] },

    stats: {
        views: { type: Number, default: 0 },
        posts: { type: Number, default: 0 },
        likes: { type: Number, default: 0 }
    }
});

// Convert Schema to Model
const User = mongoose.model('User', UserSchema);

// Export the Model
module.exports = User;
