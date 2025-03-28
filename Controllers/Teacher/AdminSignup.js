const AdmSignup = async (req, res) => {
    try {
        const { email, name, password, role, FuckltyOf } = req.body;

        console.log("data", req.body);

        if (!email || !password || !name || !role || !FuckltyOf) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const isUserPresent = await AdminModel.findOne({ AdminEmail: email });
        if (isUserPresent) {
            return res.status(200).json({
                message: "User already exists, please login",
                success: false,
            });
        }

        const otp = GeneratedOtp();
        await client.set(`otp:${email}`, otp);

        // Send OTP email first
        const responseEmail = await EmailSender(email, otp);
        console.log("Email sending response:", responseEmail);

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

        console.log("Encrypted Password:", hashpass);

        // Save data in Redis
        const dataToSave = {
            AdminName: name,
            AdminEmail: email,
            password: hashpass,
            role: role,
            Department: FuckltyOf,
        };
        await client.set(`data:${email}`, JSON.stringify(dataToSave));

        // Send response only once
        return res.status(201).json({
            message: `OTP sent successfully to ${email}`,
            success: true,
            user: dataToSave
        });

    } catch (error) {
        res.status(500).json({
            message: "Error signing up user",
            success: false,
            error: error.message
        });
    }
};
