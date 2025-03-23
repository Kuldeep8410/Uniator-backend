const AttendanceModel = require('./models/AttendanceModel');
const CourseModel = require('./models/CourseModel');

async function markAttendance(courseCode, date, studentId, status = 'Present') {
    const course = await CourseModel.findOne({ courseCode });
    if (!course) throw new Error("Course not found");

    const attendanceDate = new Date(date).setHours(0, 0, 0, 0);

    let attendanceRecord = await AttendanceModel.findOne({ course: course._id, date: attendanceDate });

    if (!attendanceRecord) {
        attendanceRecord = new AttendanceModel({
            course: course._id,
            date: attendanceDate,
            attendanceRecords: [{ student: studentId, status }]
        });
    } else {
        const existingStudent = attendanceRecord.attendanceRecords.find(
            record => record.student.toString() === studentId.toString()
        );

        if (existingStudent) {
            existingStudent.status = status; // Update status if already exists
        } else {
            attendanceRecord.attendanceRecords.push({ student: studentId, status });
        }
    }

    await attendanceRecord.save();
    console.log(`Attendance marked for student ${studentId} in course ${courseCode}.`);
}
