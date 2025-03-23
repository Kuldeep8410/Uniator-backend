const AdminModel = require('../Models/AdminModel');
const Adminstrator = require('../Models/AminstratorModel')

async function AddQrData(req, res) {
    try {
        const { Entry_Qr, Exit_Qr, AdminEmail } = req.body; // Use req.body instead of req.params
        console.log("Received Data:", req.body);

        if (!Entry_Qr || !Exit_Qr || !AdminEmail) {
            return res.status(400).json({
                message: "Missing required data",
                success: false
            });
        }

        // Check if admin exists
        const isAdmin = await Adminstrator.findOne({ email : AdminEmail });
        if (!isAdmin) {
            console.log("not authorize")
            return res.status(403).json({
                message: "You are not authorized as an admin",
                success: false
            });
        }

        // Update QR values
        const updatedData = await Adminstrator.findOneAndUpdate(
            { email:AdminEmail },
            { Exit_Qr, Entry_Qr },
            { new: true, runValidators: true } // Return updated document and validate inputs
        );

        if (!updatedData) {
            return res.status(500).json({
                message: "Failed to update QR data",
                success: false
            });
        }

        return res.status(200).json({
            message: "QR data updated successfully",
            success: true,
            data: updatedData
        });

    } catch (error) {
        console.error("Error while updating QR data:", error);
        return res.status(500).json({
            message: "Server-side error",
            success: false
        });
    }
}

module.exports = AddQrData;
