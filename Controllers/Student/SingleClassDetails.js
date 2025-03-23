const UserModel = require('../../Models/UserSchema');
const AttendanceModel = require('../../Models/Attendance');
const ClassModel = require('../../Models/ClassModel')

async function SingleClassDetails(req, res) {
    try {
        const { email, courseCode } = req.query;

        // console.log("Received data:", { email, courseCode });

        if (!email || !courseCode) {
            // console.log("Incomplete request data.");
            return res.status(400).json({
                message: "Incomplete request received",
                success: false,
            });
        }

        const student = await UserModel.findOne({ email }).select("_id");

        if (!student) {
            return res.status(404).json({ message: "Student not found", success: false });
        }

        const course = await ClassModel.findOne({ courseCode }).select("_id");
        if (!course) {
            return res.status(400).json({
                message: "Course does not exist",
                success: false
            });
        }
        const courseId = course._id;
        // console.log(courseId)



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
                // console.error("Error fetching attended classes:", error);
                return 0;
            }
        };

        const getTotalClasses = async (courseId) => {
            try {
                const totalClasses = await AttendanceModel.countDocuments({ course: courseId });
                return totalClasses;
            } catch (error) {
                return 0;
            }
        };

        let totalClass;
        let presentsClass;

        const fetchingdata = async (classId, userId) => {
            const idcourse = classId;
            const stdid = userId;


            totalClass = await getTotalClasses(idcourse);
            presentsClass = await getClassesAttendedByStudent(idcourse, stdid);

        
            return res.status(200).json({
                message: "Your attendance has been marked successfully",
                success: true,
                totalClass: totalClass,
                attendendClass: presentsClass,
            });
        };

        fetchingdata(courseId, student);

    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
}

module.exports = SingleClassDetails;
