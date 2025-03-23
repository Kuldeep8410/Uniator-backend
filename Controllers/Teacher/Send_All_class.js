const ClassModel = require('../../Models/ClassModel');
const AdminModel = require('../../Models/AdminModel');

async function SendAllClass(req, res) {
    try {
        const { email, role } = req.query; 
        console.log("Data received:", req.query);

        if (!email || !role) {
            return res.status(400).json({
                message: "Invalid request. Email and role are required.",
                success: false
            });
        }

        const AdminAvailable = await AdminModel.findOne({ AdminEmail: email });

        if (!AdminAvailable || AdminAvailable.role !== role) {
            return res.status(403).json({
                message: "Unauthorized: You are not an admin or account does not exist.",
                success: false
            });
        }
        const deparment = AdminAvailable.Department

        // Fetch all class data
        const AllClassData = await ClassModel.find({Department : deparment}).select("courseCode courseName Teacher createdAt isActive Department enddate startEntry endEntry");

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

module.exports = SendAllClass;
