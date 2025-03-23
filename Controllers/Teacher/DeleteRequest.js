const CourseModel = require('../../Models/ClassModel');
const AdminModel = require('../../Models/AdminModel');

async function DeletedCourse(req, res) {
    try {
        let { courseId } = req.params; // Extract courseId from params
        console.log("Received courseId:", courseId);

        if (!courseId) {
            return res.status(400).json({
                message: "Invalid course ID",
                success: false
            });
        }

        courseId = courseId.trim();
        console.log("Processed courseId:", courseId);

        // const email = "gk3@gmail.com"; 

        const isCourseAvailable = await CourseModel.findOne({ courseCode: courseId });

        console.log("Course details:", isCourseAvailable);

        if (!isCourseAvailable) {
            return res.status(400).json({
                message: "Course not available",
                success: false
            });
        }

        // const adminAvailable = await AdminModel.findOne({ AdminEmail: email });

        // if (!adminAvailable) {
        //     return res.status(403).json({
        //         message: "You are not authorized to delete this course",
        //         success: false
        //     });
        // }

        // 🔹 Delete course
        const deleteResponse = await CourseModel.findByIdAndDelete(isCourseAvailable._id);

        if (!deleteResponse) {
            return res.status(500).json({
                message: "Unable to delete the course, try again later",
                success: false
            });
        }

        return res.status(200).json({
            message: `Successfully deleted course: ${courseId}`,
            success: true
        });

    } catch (error) {
        console.error("Error while deleting course:", error);
        return res.status(500).json({
            message: "Server-side error",
            success: false
        });
    }
}

module.exports = DeletedCourse;
