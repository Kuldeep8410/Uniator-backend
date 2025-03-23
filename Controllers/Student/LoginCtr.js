const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const Department = require('./SelectDepartment');

const userModel = require('../../Models/UserSchema');

const LoginCtrl = async (req, res) => {
    try {
        dotenv.config();
        const { username, email, password } = req.body;
        console.log("login info", username, email, password);

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "bro conf inputs",
                success: false
            })
        }

        const isUserExists = await userModel.findOne({ email: email })
        console.log(isUserExists);

        if (!isUserExists) {
            return res.status(400).json({
                message: "please make sign up",
                success: false
            })
        }

        //defining student department
        const StudentYearAndDep = email.substring(0, 8)
        




        const passwordVerify = await bcrypt.compare(password, isUserExists.password)
        if (!passwordVerify) {
            return res.status(400).json({
                message: "Bro Wrong password",
                success: false,
            })
        }

        //if password is correct then create jwt token
        const Myjwt = jwt.sign({ email: isUserExists.email, _id: isUserExists, role: isUserExists.role },
            process.env.JWT_SECRETE,
            { expiresIn: '24h' }
        )

        //Method 01 to sending data to frontend 

        // return res.status(200).json({
        //     message : "login successfully",
        //     success : true,
        //     Myjwt,
        //     role : isUserExists.role,
        //     name : isUserExists.username,
        //     email : isUserExists.email,
        // })

        // method 02:- to sending data to frontend :---> use of cookies
        return res
            .status(200)
            .cookie("Myjwt", Myjwt, {
                httpOnly: true, // Prevent client-side JavaScript access
                secure: true,   // Send only over HTTPS (enable in production)
                sameSite: "Strict", // Prevent CSRF attacks
                maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
            })
            .json({
                message: "Login successfully",
                success: true,
                role: isUserExists.role,
                name: isUserExists.username,
                email: isUserExists.email,
                StudentDepAndYear : StudentYearAndDep,
            });



    } catch (error) {
        res.status(500).json({
            message: "Server side error For login",
            success: false
        })

    }
}

module.exports = LoginCtrl;