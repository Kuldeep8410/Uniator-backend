const express = require('express');
const bcrypt = require('bcrypt');
const AdminModel = require('../../Models/AdminModel');  // Admin == Teacher
const GeneratedOtp = require('../OtpGenerator');
const EmailSender = require('../EmailToUser');
const client = require('../../client');

const AdmSignup = async (req, res) => {
    try {
        const { email, name, password, role, FuckltyOf } = req.body;

        // console.log("Received Data:", req.body);

        // Validate input fields
        if (!email || !password || !name || !role || !FuckltyOf) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Check if the user already exists
        const isUserPresent = await AdminModel.findOne({ AdminEmail: email });
        if (isUserPresent) {
            return res.status(200).json({
                message: "User already exists, please login",
                success: false,
            });
        }

        // Generate OTP and store it in Redis
        const otp = GeneratedOtp();
        await client.set(`otp:${email}`, otp);

        // console.log("OTP saved to Redis:", otp);

        // Send OTP email to user
        const responseEmail = await EmailSender(email, otp);
        console.log("Email Sending Response:", responseEmail);

        if (!responseEmail) {
            return res.status(500).json({
                message: "Error sending email, please try again",
                success: false,
            });
        }

        // Encrypt password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashpass = await bcrypt.hash(password, salt);

        // console.log("Encrypted Password:", hashpass);

        // Save user data to Redis
        const dataToSave = {
            AdminName: name,
            AdminEmail: email,
            password: hashpass,
            role: role,
            Department: FuckltyOf,
        };

        await client.set(`data:${email}`, JSON.stringify(dataToSave));

        // Send final success response
        return res.status(201).json({
            message: `OTP sent successfully to ${email}`,
            success: true,
            user: dataToSave
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            message: "Error signing up user",
            success: false,
            error: error.message
        });
    }
};

module.exports = AdmSignup;
