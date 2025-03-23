const ClassModel = require('../../Models/ClassModel');
const UserModel = require('../../Models/UserSchema');
const SelectStudentDep = require('./SelectDepartment');

async function AllClasstudent(req, res) {
    try {
        const { email, role } = req.query; 
        console.log("Data received:", req.query);

        if (!email || !role) {
            return res.status(400).json({
                message: "Invalid request. Email and role are required.",
                success: false
            });
        }

        const StudentAvailable = await UserModel.findOne({ email: email });
        console.log("rollll ",StudentAvailable)

        if (!StudentAvailable || StudentAvailable.role !== role) {
            return res.status(403).json({
                message: "Unauthorized: You are not an admin or account does not exist.",
                success: false
            });
        }

        //finding department of student
        const StudentDepAndYear = email.substring(0,8);
        const extractEmail = email.substring(2,2+3);
        const StudentDep = SelectStudentDep(extractEmail);

        console.log("dep",StudentDep,extractEmail,StudentDepAndYear)


        // Fetch all class data
        const AllClassData = await ClassModel.find({
            Department: StudentDep,
            startEntry: { $lte: StudentDepAndYear },
            endEntry: { $gte: StudentDepAndYear }
        }).select("courseCode courseName Teacher createdAt isActive startEntry endEntry");

        console.log(AllClassData)

        return res.status(200).json({
            message: "Fetched all classes successfully",
            success: true,
            data: AllClassData
        });

    } catch (error) {
        console.error("Error fetching class data:", error);
        return res.status(500).json({
            message: "Internal Server Error while fetching class data",
            success: false,
            error: error.message 
        });
    }
}

module.exports = AllClasstudent;
