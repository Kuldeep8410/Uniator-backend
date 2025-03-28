const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const AdmnModel = require('../../Models/AdminModel');

const AminLogin = async (req, res) => {
    try {
        dotenv.config();
        const {email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "teacher conf inputs",
                success: false
            })
        }

        const isUserExists = await AdmnModel.findOne({ AdminEmail: email })
        // console.log(isUserExists);

        if (!isUserExists) {
            return res.status(400).json({
                message: "please make sign up",
                success: false
            })
        }
        // console.log("user dep",isUserExists.Department)

        const passwordVerify = await bcrypt.compare(password, isUserExists.password)
        if (!passwordVerify) {
            return res.status(400).json({
                message: "teacher Wrong password",
                success: false,
            })
        }

        //if password is correct then create jwt token
        const Myjwt = jwt.sign({ email: isUserExists.email, _id: isUserExists, role: isUserExists.role },
            process.env.JWT_SECRETE,
            { expiresIn: '24h' }
        )

        return res
            .status(200)
            .cookie("AdminCookie", Myjwt, {
                httpOnly: true, // Prevent client-side JavaScript access
                secure: true,   // Send only over HTTPS (enable in production)
                sameSite: "Strict", // Prevent CSRF attacks
                maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
            })
            .json({
                message: "Login successfully",
                success: true,
                role: isUserExists.role,
                name: isUserExists.AdminName,
                email: isUserExists.AdminEmail,
                Department : isUserExists.Department
            });



    } catch (error) {
        res.status(500).json({
            message: "Server side error For login",
            success: false
        })

    }
}

module.exports = AminLogin;