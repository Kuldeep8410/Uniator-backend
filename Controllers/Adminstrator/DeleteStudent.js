const AdminstratorModel = require('../../Models/AminstratorModel');
const UserModel = require('../../Models/UserSchema');

async function DeleteStudent(req, res) {
    try {
        const { AdminEmail, userEmail } = req.query;
        // console.log("delete data", req.query);


        if (!AdminEmail || !userEmail) {
            return res.status(400).json({
                message: "InSuffiecient Data",
                success: false
            });
        }


        // Check if user exists
        const isUserPresent = await UserModel.findOne({ email: userEmail });
        if (!isUserPresent) {
            return res.status(400).json({
                message: "Sorry! User Not Exists",
                success: false
            });
        }


        // Check if admin is genuine
        const isAdministrator = await AdminstratorModel.findOne({ email: AdminEmail });
        if (!isAdministrator) {
            return res.status(401).json({
                message: "Bad Request, unauthorize",
                success: false
            });
        }


        // Verification done, start deletion process
        const deletionResponse = await UserModel.findByIdAndDelete(isUserPresent._id);
        if (!deletionResponse) {
            return res.status(400).json({
                message: "Error While deleting user",
                success: false
            });
        }



        return res.status(200).json({
            message: "User Has Been Deleted",
            success: true
        });


        
    } catch (error) {
        console.log("error in admin deleting user", error);
        return res.status(500).json({
            message: "Server Side Error",
            success: false
        });
    }
}

module.exports = DeleteStudent;
