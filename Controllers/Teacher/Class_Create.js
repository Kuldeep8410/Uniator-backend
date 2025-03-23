const ClassModel = require('../../Models/ClassModel')

async function ClassCreate(req, res) {
    try {
        const { courseCode, courseName, Teacher, isActive, enddate,
            startEntry,
            endEntry,
            Department } = req.body;
        console.log("course data ", req.body)


        if (!courseCode || !courseName || !Teacher || !enddate || !startEntry || !endEntry || !Department) {
            return res.status(400).json({
                message: "either teacher or course data unvailable",
                success: false
            })
        }

        const isCoursePresent = await ClassModel.findOne({ courseCode: courseCode });
        if (isCoursePresent) {
            return res.status(400).json({
                message: "course already exists",
                success: false
            })
        }
        if (!isCoursePresent) {
            //create new course
            const newObj = {
                courseCode: courseCode,
                courseName: courseName,
                Teacher: Teacher,
                isActive: isActive,
                enddate: enddate,
                startEntry: startEntry,
                endEntry: endEntry,
                Department: Department,
            }
            const doc = await ClassModel(newObj).save();
            return res.status(200).json({
                message: "Class Created Succesfully",
                success: true
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "error in server for Class creation",
            success: false
        })

    }

}

module.exports = ClassCreate;