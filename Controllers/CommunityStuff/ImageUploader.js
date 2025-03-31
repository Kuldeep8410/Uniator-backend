const cloudinary = require("cloudinary").v2;
const UserModel = require("../../Models/UserSchema");

async function uploadToCloudinary(filePath, folder) {
    try {
        const options = { folder };
        return await cloudinary.uploader.upload(filePath, options);
    } catch (error) {
        console.log("Error in Cloudinary upload function:", error);
        throw new Error("Cloudinary upload failed");
    }
}

async function UploadController(req, res) {
    try {
        const { email } = req.body;
        console.log("Uploader email:", email);
        // console.log(req.files)


        if (!email || !req.files || !req.files.gkcloud) {
            return res.status(400).json({
                success: false,
                message: "Missing necessary data",
            });
        }

        const isUserExist = await UserModel.findOne({ email });
        if (!isUserExist) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized",
            });
        }

        const file = req.files.gkcloud;
        

        if (!file.tempFilePath) {
            return res.status(400).json({
                success: false,
                message: "Invalid file data",
            });
        }


        const response = await uploadToCloudinary(file.tempFilePath, "gkCloud");

        res.status(200).json({
            success: true,
            message: "Image successfully uploaded",
            data: response,
            Image_url: response.secure_url,
        });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload image",
        });
    }
}

module.exports = UploadController;