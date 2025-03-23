const client = require('../client');
const UserModel = require('../Models/UserSchema');

async function OtpVarification(req, res) {
    try {
        const { email, otp } = req.body; 

        const otpRedis = await client.get(`otp:${email}`);

        if (!otpRedis) {
            return res.status(400).json({
                message: "OTP expired or not found",
                success: false
            });
        }
        if (otpRedis !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false
            });
        }

        const userDataRedis = await client.get(`data:${email}`);
        if (!userDataRedis) {
            return res.status(400).json({
                message: "User data not found, please retry",
                success: false
            });
        }

        const parsedUserData = JSON.parse(userDataRedis);
        if (!parsedUserData || parsedUserData.email !== email) {
            return res.status(400).json({
                message: "Invalid user data, please retry",
                success: false
            });
        }

        const dataToSave = new UserModel(parsedUserData);
        await dataToSave.save();

        await client.del(`otp:${email}`);
        await client.del(`data:${email}`);

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
