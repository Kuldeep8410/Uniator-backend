const ClassModel = require('../../Models/ClassModel');

async function SetAllowedLocation(req, res) {
    try {

        const { longitude, latitude, radius, courseCode } = req.body;
        console.log("Received Data:", req.body);

        // Check if all required fields are provided
        if (!longitude || !latitude || !radius || !courseCode) {
            return res.status(400).json({
                message: "Data not received properly",
                success: false
            });
        }
        console.log("hello1")
        // Update class location details
        const isClassExist = await ClassModel.findOneAndUpdate(
            { courseCode: courseCode },
            { 
                $set: { 
                    longitude: longitude, 
                    latitude: latitude, 
                    radius: radius 
                } 
            },
            { new: true } // Returns the updated document
        );
        console.log("hello2")

        if (!isClassExist) {
            return res.status(404).json({
                message: "Class not found",
                success: false
            });
        }
        console.log("hello3")
        return res.status(200).json({
            message: "Location and Radius Updated Successfully",
            success: true
        });
        
    } catch (error) {
        console.error("Error while updating location:", error);
        return res.status(500).json({
            message: "Failed to update the location data",
            success: false
        });
    }
}

module.exports = SetAllowedLocation;