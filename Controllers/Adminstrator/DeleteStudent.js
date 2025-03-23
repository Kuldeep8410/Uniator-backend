const AdminstratorModel = require('../../Models/AminstratorModel');
const UserModel = require('../../Models/UserSchema');

async function DeleteStudent(req, res) {
    try {
        const { AdminEmail, userEmail } = req.query;
        console.log("delete data", req.query);


        if (!AdminEmail || !userEmail) {
            return res.status(400).json({
                message: "kya bhai data nahi aya laat marke nikalne ka",
                success: false
            });
        }


        // Check if user exists
        const isUserPresent = await UserModel.findOne({ email: userEmail });
        if (!isUserPresent) {
            return res.status(400).json({
                message: "Sorry Malik User exist Na Kre LA",
                success: false
            });
        }


        // Check if admin is genuine
        const isAdministrator = await AdminstratorModel.findOne({ email: AdminEmail });
        if (!isAdministrator) {
            return res.status(401).json({
                message: "Admin Fargii Hai, Ya email Galat Hai",
                success: false
            });
        }


        // Verification done, start deletion process
        const deletionResponse = await UserModel.findByIdAndDelete(isUserPresent._id);
        if (!deletionResponse) {
            return res.status(400).json({
                message: "Acchi Koshish thi malik try again, Data genuine hai",
                success: false
            });
        }



        return res.status(200).json({
            message: "Chaliye malik apki mehnat Saphal hui Student ko laat marke nikal diye",
            success: true
        });


        
    } catch (error) {
        console.log("error in admin deleting user", error);
        return res.status(500).json({
            message: "malik ye server ki Ma** chud gayi",
            success: false
        });
    }
}

module.exports = DeleteStudent;
