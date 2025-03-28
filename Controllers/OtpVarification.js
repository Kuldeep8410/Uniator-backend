const client = require('../client');
const UserModel = require('../Models/UserSchema');
const AdminModel = require('../Models/AdminModel');

async function OtpVerification(req, res) {
    try {
        const dataObject = req.body;
        console.log("otp verification", req.body);

        // Check if the request body contains necessary data
        if (!dataObject || !dataObject.email || !dataObject.otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
                success: false
            });
        }

        // Get OTP from Redis
        const otpRedis = await client.get(`otp:${dataObject.email}`);
        console.log("redis get operation", otpRedis);

        // Validate OTP
        if (!otpRedis || otpRedis !== dataObject.otp) {
            return res.status(400).json({
                message: "Invalid OTP or OTP expired",
                success: false
            });
        }

        // Get user data from Redis
        const userDataRedis = await client.get(`data:${dataObject.email}`);
        console.log("redis user data", userDataRedis);

        // Check if user data is found in Redis
        if (!userDataRedis) {
            return res.status(400).json({
                message: "User data not found, please retry",
                success: false
            });
        }

        // Parse the retrieved Redis data
        const parsedUserData = JSON.parse(userDataRedis);

        // Save the user data to the appropriate model
        if (parsedUserData.role === "Admin-user") {
            // Check if the parsed data's email matches the one in the request body
            if (parsedUserData.AdminEmail !== dataObject.email) {
                return res.status(400).json({
                    message: "User data mismatch, please retry",
                    success: false
                });
            }

            const adminData = new AdminModel(parsedUserData);
            await adminData.save();



        } else if (parsedUserData.role === "normal-user") {
            // Check if the parsed data's email matches the one in the request body
            if (parsedUserData.email !== dataObject.email) {
                return res.status(400).json({
                    message: "User data mismatch, please retry",
                    success: false
                });
            }
            const userData = new UserModel(parsedUserData);
            await userData.save();
        }

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

module.exports = OtpVerification;