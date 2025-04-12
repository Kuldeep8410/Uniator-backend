const ClassModel = require("../../Models/ClassModel");

async function VarifyLocation(req, res) {
    try {
        // GET request
        const { longitude, latitude, classId } = req.query;
        // console.log(req.query)

        if (!longitude || !latitude || !classId) {
            return res.status(400).json({
                message: "Data not received properly",
                success: false
            });
        }

        // Find class and select required fields
        const isClassExist = await ClassModel.findById(classId).select("longitude latitude radius");

        if (!isClassExist) {
            return res.status(400).json({
                message: "Sorry, Darling! You're at the Wrong Class 😜",
                success: false
            });
        }

        const longitude1 = parseFloat(isClassExist.longitude);
        const latitude1 = parseFloat(isClassExist.latitude);
        const radius1 = parseFloat(isClassExist.radius); // FIXED: Get correct radius

        const longitude2 = parseFloat(longitude);
        const latitude2 = parseFloat(latitude);

        // Haversine Formula for calculating distance between two coordinates
        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radius of Earth in kilometers
            const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
            const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert degrees to radians
            
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in kilometers
        }

        const distanceCalculated = calculateDistance(latitude1, longitude1, latitude2, longitude2) * 1000;

        if (distanceCalculated < radius1) {
            return res.status(200).json({
                message: "You Can Mark Attendance ✅",
                success: true,
                range : radius1,
                currentDistance : distanceCalculated
            });
        } else {
            return res.status(200).json({
                message: "Out of range 🤔",
                success: false,
                range : radius1,
                currentDistance : distanceCalculated
            });
        }
        
    } catch (error) {
        console.error("Error in verification:", error);
        return res.status(500).json({
            message: "Failed to verify your location",
            success: false
        });
    }
}

module.exports = VarifyLocation;