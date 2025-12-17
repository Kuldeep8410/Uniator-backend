const bcrypt = require("bcrypt");
const UserModel = require("../../Models/UserSchema");
const GeneratedOtp = require("../OtpGenerator");
const EmailSender = require("../EmailToUser");
const client = require("../../client");

const SignupCtrl = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill all inputs",
        success: false,
      });
    }

    const isUserPresent = await UserModel.findOne({ email });
    if (isUserPresent) {
      return res.status(409).json({
        message: "User already exists, please login",
        success: false,
      });
    }

    // Generate OTP
    const otp = GeneratedOtp();
    await client.set(`otp:${email}`, otp);

    // Send OTP email
    const emailSent = await EmailSender(email, otp);
    if (!emailSent) {
      return res.status(500).json({
        message: "Failed to send OTP email",
        success: false,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt);

    // Save user data temporarily (Redis)
    const dataToSave = {
      username,
      email,
      password: hashpass,
      role,
    };

    await client.set(`data:${email}`, JSON.stringify(dataToSave));

    //  SINGLE RESPONSE
    return res.status(201).json({
      message: "OTP sent successfully to email",
      success: true,
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Error signing up user",
      success: false,
    });
  }
};

module.exports = SignupCtrl;
