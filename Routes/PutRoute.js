const express = require('express');
const putrouter = express.Router();


const ToggleAttendance = require('../Controllers/Teacher/ToggleAttendance')
const AddQrData = require('../Controllers/AddQrByAdmin')



// COMMUNITY IMPORT
const Like = require('../Controllers/CommunityStuff/LikeOnPost');
const Dislike = require('../Controllers/CommunityStuff/DislikePost')
const CommnetOnPost = require('../Controllers/CommunityStuff/CommnetOnPost')


putrouter.put('/toggleattendance/:id', ToggleAttendance);
putrouter.put('/addordetails', AddQrData);


//COMMUNITY PUT ROUTES
putrouter.put('/make-like-on-post',Like);
putrouter.put('/make-dislike-on-post',Dislike);
putrouter.put('/make-a-comment',CommnetOnPost);

module.exports = putrouter