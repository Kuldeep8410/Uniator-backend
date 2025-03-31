const Cloudinary =require('cloudinary').v2;

const cloudinaryConnect = ()=>{

    try {
        Cloudinary.config( {
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        })

        console.log("cloudninary confuguration done succesfully");

    } catch (error) {
        console.log("failed to configure cloudinary", error)
    }
}

module.exports = cloudinaryConnect;