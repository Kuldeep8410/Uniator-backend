const CourseModel = require('../../Models/ClassModel');
const AttendanceModel = require('../../Models/Attendance');
const UserModel = require('../../Models/UserSchema');



async function StudentInCourse(req, res) {
    try {
        const { courseCode } = req.query;
        console.log("Received data:", req.query);

        if (!courseCode) {
            return res.status(400).json({
                message: "Hey Bro, Course Code is Missing",
                success: false
            });
        }


// Check if the course exists
        const isCourseAvailable = await CourseModel.findOne({ courseCode }).select("_id");
        if (!isCourseAvailable) {
            return res.status(400).json({
                message: "Saafe burbak! Baadh Sahi Course Code Daali MahaRaj!",
                success: false
            });
        }


// Get attendance records of the course
        const attendanceRecords = await AttendanceModel.findOne({ course: isCourseAvailable._id })
            .select("date attendanceRecords.student");

        if (!attendanceRecords) {
            return res.status(400).json({
                message: "Ya tah E course exists naikhe krt aur na toh galat course code ba!",
                success: false
            });
        }


// Fetch student emails for each student in attendance records
        const updatedData = await Promise.all(attendanceRecords.attendanceRecords.map(async (record) => {
            const student = await UserModel.findById(record.student).select("email");
            return {
                email: student ? student.email : "Email not found",
                date: attendanceRecords.date
            };
        }));

        return res.status(200).json({
            message: "Jay Baba Ki! Record mil gayile!",
            success: true,
            data: updatedData
        });

    } catch (error) {
        console.error("Error in StudentInCourse:", error);
        return res.status(500).json({
            message: "Chhodi Maharaj, thodi der mein aayi, server phat gayial!",
            success: false
        });
    }
}

module.exports = StudentInCourse;
