const AdminModel = require("../../Models/AdminModel");
const bcrypt = require('bcrypt')


async function AdmSignup(req, res) {
    try {
        const { email, name, password, role, FuckltyOf
        } = req.body;

        console.log("data",req.body)

        if (!email || !password || !name || !role || !FuckltyOf
        ) {
            return res.status(400).json({
                message: "all fields are required",
                success: false
            })
        }

        const userPresnt = await AdminModel.findOne({ AdminEmail: email });
        if (userPresnt) {
            return res.status(200).json({
                message: "Admin Already exits",
                success: false
            })
        }
        if (!userPresnt) {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                const newObj = {
                    AdminName: name,
                    AdminEmail: email,
                    password: hashedPassword,
                    role: role,
                    Department: FuckltyOf,
                };

                const newUser = new AdminModel(newObj);
                await newUser.save();

                return res.status(201).json({
                    message: "User registered successfully",
                    success: true,
                });
            } catch (error) {
                return res.status(500).json({
                    message: "Error saving user",
                    success: false,
                    error: error.message,
                });
            }
        }


    } catch (error) {
        console.log("error in Amd sign ",error)
        return res.status(500).json({
            message : "failure in Adminsign ctrl",
            success : false
        })

    }
}

module.exports = AdmSignup