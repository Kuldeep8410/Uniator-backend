const express = require('express');
const getrouter = express.Router();

const AllClassData = require('../Controllers/Teacher/Send_All_class');
const AllClasstudent = require('../Controllers/Student/AllClassStudent')
const All_Class_Std = require('../Controllers/Student/Student_Subjectwise')
const QrvarificationG1G2 = require('../Controllers/QrvarificationG1G2')
const AllEntries = require('../Controllers/AllEntries')

const SingleClassDetail = require('../Controllers/Student/SingleClassDetails')



//teacher Imports
const AttendByStudentEntry = require('../Controllers/Teacher/AttendanceByEntry');
const AllStudentAttendance = require('../Controllers/Teacher/AttendanceByCourse');

//Adminstrator Get Routes
const StudentDeletion = require('../Controllers/Adminstrator/DeleteStudent');


//COMMUNITY IMPORTS
const RetriveAllPost = require('../Controllers/CommunityStuff/RetriveAllPosts');
const ShowCommentOnPost = require('../Controllers/CommunityStuff/ShowCommentOnPost');




//Adminstrator controllers
getrouter.get('/delete-student-adminstrator',StudentDeletion)
getrouter.get('/get-all-class-adm', AllClassData);
getrouter.get('/get-all-class-students', AllClasstudent);
getrouter.get('/student-sub-detail-attendance', All_Class_Std);
getrouter.get('/qrvarification-of-user',QrvarificationG1G2);


//teachers routes
getrouter.get('/get-student-attendance-by-entry',AttendByStudentEntry)
getrouter.get('/get-attendace-all-course',AllStudentAttendance)
getrouter.get('/all-entries-of-user',AllEntries);


//Community  get routes
getrouter.get('/get-all-post',RetriveAllPost);
getrouter.get('/comments-of-post',ShowCommentOnPost);


//student 
getrouter.get('/get-single-class-details',SingleClassDetail);

module.exports = getrouter;