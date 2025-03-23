const StudentModel = require('../../Models/UserSchema');
const CourseModel = require('../../Models/ClassModel');
const AttendanceModel = require('../../Models/Attendance');

async function AttendOfStudent(req, res) {
    try {
//got the query request
        const { courseCode, studentEmail } = req.query;
        console.log("teacher",req.query)

        if (!courseCode || !studentEmail) {
            return res.status(400).json({
                message: "Either Entry or CourseCode Not Available",
                success: false
            });
        }



// Find the student by email
        const student = await StudentModel.findOne({ email: studentEmail }).select("_id");

        if (!student) {
            return res.status(401).json({
                message: `${studentEmail} is not a registered student`,
                success: false
            });
        }



// Find the course by courseCode
        const course = await CourseModel.findOne({ courseCode: courseCode }).select("_id");
        if (!course) {
            return res.status(400).json({
                message: "Invalid Course Code",
                success: false
            });
        }



// Find all attendance records for the student in this course
        const attendanceRecords = await AttendanceModel.find(
            { course: course._id, "attendanceRecords.student": student._id },
            { attendanceRecords: { $elemMatch: { student: student._id } }, date: 1 } // Returns only matching student's attendance
        ).select("Date");
        //Includes the date field to show when the attendance was marked.
        


//check the course and student are available in Attendance model
        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({
                message: "No attendance records found for this student in the given course",
                success: false
            });
        }


// after all test sending the response
        return res.status(200).json({
            message: "Record fetched successfully",
            success: true,
            data: attendanceRecords
        });

    } catch (error) {
        console.error("Error fetching attendance records:", error);
        return res.status(500).json({
            message: "Sorry, server-side error",
            success: false
        });
    }
}

module.exports = AttendOfStudent;
