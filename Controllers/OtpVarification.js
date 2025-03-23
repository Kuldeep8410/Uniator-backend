const client = require('../client');
const UserModel = require('../Models/UserSchema');

async function OtpVarification(req, res) {
    try {
        const dataObject = req.body;
        // console.log(dataObject);

        // Get OTP from Redis
        const otpRedis = await client.get(`otp:${dataObject.email}`);

        // Validate OTP
        if (!otpRedis || otpRedis !== dataObject.otp) {
            return res.status(400).json({
                message: "Invalid OTP or OTP expired",
                success: false
            });
        }

        // Get user data from Redis
        const userDataRedis = await client.get(`data:${dataObject.email}`);
        console.log("user data redis", userDataRedis);

        if (!userDataRedis && userDataRedis.email != dataObject.email) {
            return res.status(400).json({
                message: "User data not found, please retry",
                success: false
            });
        }

        // Parse the retrieved Redis data
        const parsedUserData = JSON.parse(userDataRedis)
        // console.log("parssed data", parsedUserData);

        // Save user data to database
        const dataToSave = new UserModel(parsedUserData);
        await dataToSave.save();

        res.status(200).json({
            message: "Signup done successfully",
            success: true
        });
    } catch (error) {
        console.error("Error in OTP verification:", error);
        res.status(500).json({
            message: "Something went wrong, please try again later",
            success: false
        });
    }
}

module.exports = OtpVarification;
