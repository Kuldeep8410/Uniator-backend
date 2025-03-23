const UserModel = require("../../Models/UserSchema");
const CourseModel = require("../../Models/ClassModel");
const AttendanceModel = require("../../Models/Attendance");

async function Student_Subjectwise(req, res) {
    const { courseId, email } = req.query;
    console.log("Data received:", req.query);

    if (!courseId || !email) {
        return res.status(400).json({
            message: "Either userId or courseId is missing",
            success: false,
        });
    }

    try {
        const userData = await UserModel.findOne({ email: email });
        if (!userData) {
            return res.status(404).json({
                message: "User does not exist",
                success: false,
            });
        }
        const userId = userData._id;

        const courseData = await CourseModel.findById(courseId);
        if (!courseData) {
            return res.status(404).json({
                message: "Course does not exist",
                success: false,
            });
        }

        const attendanceRecords = await AttendanceModel.find({
            course: courseId,
            "attendanceRecords.student": userId,
            "attendanceRecords.status": "Present",
        }).select("date course"); // Selecting only date & course fields
        console.log("all bhai here ",attendanceRecords)

        if (!attendanceRecords.length) {
            return res.status(200).json({
                message: "No attendance records found",
                success: true,
                details: [],
            });
        }

        // Fetch course names using populated course field
        const result = await Promise.all(
            attendanceRecords.map(async (record) => {
                const courseDetails = await CourseModel.findById(record.course).select("courseName Teacher" );
                return {
                    subject: courseDetails ? courseDetails.courseName : "Unknown",
                    teacher : courseDetails ? courseDetails.Teacher :"Unknown",
                    date: record.date.toISOString().split("T")[0],
                };
            })
        );

        return res.status(200).json({
            message: "Fetched attendance details successfully",
            success: true,
            details: result,
        });
    } catch (error) {
        console.error("Error while fetching attendance details:", error);
        return res.status(500).json({
            message: "Unable to load data",
            success: false,
            error: error.message,
        });
    }
}

module.exports = Student_Subjectwise;








// const UserModel = require("../Models/UserSchema");
// const CourseModel = require("../Models/ClassModel");
// const AttendanceModel = require("../Models/Attendance");

// async function Student_Subjectwise(req, res) {
//     const { courseId, email } = req.query;
//     console.log("Data received:", req.query);

//     if (!courseId || !email) {
//         return res.status(400).json({
//             message: "Either courseId or email is missing",
//             success: false,
//         });
//     }

//     try {
//         // Find user by email
//         const userData = await UserModel.findOne({ email }).select("_id");
//         if (!userData) {
//             return res.status(404).json({
//                 message: "User does not exist",
//                 success: false,
//             });
//         }
//         const userId = userData._id;

//         // Find attendance records where student is present
//         const attendanceRecords = await AttendanceModel.find({
//             course: courseId,
//             "attendanceRecords.student": userId,
//             "attendanceRecords.status": "Present",
//         })
//         .populate("course", "courseName Teacher") // Populate course details
//         .select("date course"); // Selecting only date & course

//         console.log("All attendance records:", attendanceRecords);

//         if (!attendanceRecords.length) {
//             return res.status(200).json({
//                 message: "No attendance records found",
//                 success: true,
//                 details: [],
//             });
//         }

//         // Transform data into desired format
//         const result = attendanceRecords.map(record => ({
//             subject: record.course ? record.course.courseName : "Unknown",
//             teacher: record.course ? record.course.Teacher : "Unknown",
//             date: record.date.toISOString().split("T")[0], // Formatting date to YYYY-MM-DD
//         }));

//         return res.status(200).json({
//             message: "Fetched attendance details successfully",
//             success: true,
//             details: result,
//         });

//     } catch (error) {
//         console.error("Error while fetching attendance details:", error);
//         return res.status(500).json({
//             message: "Unable to load data",
//             success: false,
//             error: error.message,
//         });
//     }
// }

// module.exports = Student_Subjectwise;
