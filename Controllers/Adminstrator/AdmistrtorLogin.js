const AdministratorModel = require("../../Models/AminstratorModel"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

async function AdministratorLogin(req, res) {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(400).json({
        message: "Error in Fetching Data",
        success: false,
      });
    }

    // 🔹 Check if the user exists
    const isAdministrator = await AdministratorModel.findOne({ email: email });
    console.log(isAdministrator);

    if (!isAdministrator) {
      return res.status(401).json({
        message: "You are not an Administrator. Don't try again.",
        success: false,
      });
    }

    console.log(isAdministrator.role);

    const correctPass = await bcrypt.compare(password, isAdministrator.password);
    console.log(correctPass);

    if (!correctPass) {
      return res.status(401).json({
        message: "Incorrect Password",
        success: false,
      });
    }

    if (isAdministrator.role === "Administrator") {
      console.log("Password is correct");

      // 🔹 Generate JWT
      const adminJwt = jwt.sign(
        { email: isAdministrator.email, _id: isAdministrator._id, role: isAdministrator.role },
        process.env.JWT_SECRETE,
        { expiresIn: "24h" }
      );

      res.cookie("AdminCookie", adminJwt, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
      });

      return res.status(200).json({
        message: "Successfully Logged In, Redirecting...",
        success: true,
        data: {
          role: "Administrator",
          email: isAdministrator.email,
        },
        token: adminJwt,
      });
    }
  } catch (error) {
    console.log("Error in Administrator Login: ", error);
    return res.status(500).json({
      message: "Server Error, Please Try Again Later",
      success: false,
    });
  }
}

module.exports = AdministratorLogin;
