const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttendanceSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    date: {
        type: Date,
        required: true,
        default: () => new Date(), // Store date only (no time).setHours(0, 0, 0, 0)
    },
    attendanceRecords: [
        {
            student: { type: Schema.Types.ObjectId, ref: "User", required: true },
            status: { type: String, enum: ['Present', 'Absent'], required: true },
        }
    ],
}, { timestamps: true });

AttendanceSchema.index({ course: 1, date: 1 }, { unique: true }); // Prevent duplicate course-date entries

const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
module.exports = AttendanceModel;
