const AttendanceModel = require('../../Models/Attendance');
const UserModel = require('../../Models/UserSchema')

async function Attendance_marking(req, res) {
    try {
        const { classId, email, status } = req.body;
        console.log("Attendance data ", req.body);

        if (!classId || !email || !status) {
            return res.status(400).json({
                message: "Class ID, User ID, and status are required",
                success: false
            });
        }

        const studentExist = await UserModel.findOne({ email: email })
        console.log("student data ", studentExist._id)
        if (!studentExist) {
            return res.status(400).json({
                message: "Student Not Exists",
                success: false
            })
        }
        const userId = studentExist._id;

        // Find attendance for the given class on today's date
        const today = new Date() //.setHours(0, 0, 0, 0)
        let attendance = await AttendanceModel.findOne({ course: classId, date: today });

        if (!attendance) {
            // If no attendance exists for today, create a new record
            attendance = new AttendanceModel({
                course: classId,
                date: today,
                attendanceRecords: [{ student: userId, status }]
            });

        } else {
            // Check if student already marked attendanc
            const existingRecord = attendance.attendanceRecords.find(record => record.student.toString() == userId);
            if (existingRecord) {
                return res.status(400).json({
                    message: "Attendance already marked for this student",
                    success: false
                });
            }

            // Add the student's attendance
            attendance.attendanceRecords.push({ student: userId, status });
        }
        await attendance.save();



        //try to fetch all attendance of this student for this course
        //course count === total number of classes,
        //corseid and student id == student attendance
        const getClassesAttendedByStudent = async (courseId, studentId) => {
            try {
                const attendedClasses = await AttendanceModel.countDocuments({
                    course: courseId,
                    "attendanceRecords": {
                        $elemMatch: { student: studentId, status: "Present" }
                    }
                });
                return attendedClasses;
            } catch (error) {
                console.error("Error fetching attended classes:", error);
                return 0;
            }
        };

        const getTotalClasses = async (courseId) => {
            try {
                const totalClasses = await AttendanceModel.countDocuments({ course: courseId });
                return totalClasses;
            } catch (error) {
                console.error("Error fetching total classes:", error);
                return 0;
            }
        };

        let totalClass;
        let presentsClass;

        const fetchingdata = async (classId, userId) => {
            const idcourse = classId;
            const stdid = userId;

            console.log("Fetching data for:", idcourse, stdid);

            totalClass = await getTotalClasses(idcourse);
            presentsClass = await getClassesAttendedByStudent(idcourse, stdid);

            console.log("Total Classes:", totalClass);  
            console.log("Presented in Class:", presentsClass);

            return res.status(200).json({
                message: "Your attendance has been marked successfully",
                success: true,
                sutta: "kya re laude",
                totalClass: totalClass, 
                attendendClass: presentsClass,
            });
        };

        fetchingdata(classId, userId);

    } catch (error) {
        console.error("Error marking attendance:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

module.exports = Attendance_marking;
