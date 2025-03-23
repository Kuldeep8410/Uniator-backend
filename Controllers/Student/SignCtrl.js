const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../../Models/UserSchema');
const GeneratedOtp = require('../OtpGenerator');
const EmailSender = require('../EmailToUser');

const client = require('../../client');

const SignupCtrl = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        console.log(req.body);

        // 🛑 Check if required fields are present
        if (!username || !email || !password || !role) {
            return res.status(400).json({
                message: "Please fill all inputs",
                success: false
            });
        }

        // 🛑 Check if user already exists
        const isUserPresent = await UserModel.findOne({ email: email });
        if (isUserPresent) {
            return res.status(200).json({
                message: "User already exists, please login",
                success: false,
            });
        }

        // ✅ Generate OTP and save to Redis
        const otp = GeneratedOtp();
        await client.set(`otp:${email}`, otp, 'EX', 300);
        console.log("OTP saved to Redis:", otp);

        // ✅ Encrypt password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashpass = await bcrypt.hash(password, salt);
        console.log("Encrypted Password:", hashpass);

        // ✅ Save user data temporarily in Redis (not DB yet)
        const dataToSave = { username, email, password: hashpass, role };
        await client.set(`data:${email}`, JSON.stringify(dataToSave), 'EX', 300);

        console.log("User data saved to Redis:", dataToSave);

        // ✅ Send email in background (no need to wait)
        EmailSender(email, otp)
            .then(() => console.log(`OTP sent successfully to ${email}`))
            .catch(err => console.error(`Error sending OTP: ${err.message}`));

        // ✅ Send response (only one)
        return res.status(201).json({
            message: "User OTP sent to email successfully!",
            success: true
        });

    } catch (error) {
        console.error("Signup error:", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Error signing up user", error: error.message });
        }
    }
};

module.exports = SignupCtrl;
