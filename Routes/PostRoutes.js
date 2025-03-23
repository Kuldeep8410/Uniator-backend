const express = require('express');
const router = express.Router();

const signupctrl  = require('../Controllers/Student/SignCtrl');
const signUpValidation = require('../Middlewares/SignMidware');
const LoginValid = require('../Middlewares/LoginMidware')
const LoginCtrl = require('../Controllers/Student/LoginCtr')
const OtpVarification = require('../Controllers/OtpVarification');
const GoogleLogin = require('../Controllers/GoogleSignup')
const QrVarifi = require('../Controllers/Qr_varifi')

const AdminSignup = require('../Controllers/Teacher/AdminSignup')
const AdminLogin = require('../Controllers/Teacher/AdminLogin')
const ClassCreate = require('../Controllers/Teacher/Class_Create')
const Attendance_marking = require('../Controllers/Student/Attendance_Marking')

const DeleteCourse = require('../Controllers/Teacher/DeleteRequest')


const AdminstratorLogin = require('../Controllers/Adminstrator/AdmistrtorLogin')


//COMMUNITY IMPORT HERE
const MakeApost = require('../Controllers/CommunityStuff/MakePost')
 


//todos imports
// const AddUser = require('../controllers/AddUser');
// const AddTask = require('../controllers/AddTask');
// const deleteTasks = require('../controllers/DeleteTask');
// const completedTasks = require('../controllers/CompletedTask');
// const Alltasks = require('../controllers/all-gets/Alltasks');

// 
router.post('/signup',signUpValidation, signupctrl);
router.post('/login', LoginCtrl);
router.post('/optvarification', OtpVarification);
router.post('/google-login-data', GoogleLogin);
router.post('/qr-scan-varification',QrVarifi);
router.post('/admin-sign-up', AdminSignup);
router.post('/admin-login',AdminLogin)

router.post('/ClassCreate', ClassCreate)
router.post('/attendance-marking',Attendance_marking)


router.delete('/delete-course/:courseId', DeleteCourse);


//admins works from here
router.post('/adminstrator-login',AdminstratorLogin)



//COMMUNITY STUFF HERE
router.post('/make-a-post',MakeApost);




//todos routes are here
// router.post('/adduser', AddUser);
// router.put('/addtask',AddTask)
// router.put('/deletetask',deleteTasks);
// router.put('/completed-tasks',completedTasks);

// router.get('/get-all-tasks/:email',Alltasks)

module.exports = router;