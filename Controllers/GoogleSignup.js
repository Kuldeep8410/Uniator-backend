const GoogleSchema = require('../Models/UserGoogle');

 async function GoogleSignup (req,res){
    try {
        const frontendData = req.body;
        console.log("Data from frontend google wala",frontendData);

        //if user exist previously then 
        const isUserPresent = await GoogleSchema.findOne({ email: frontendData.email });
        if(isUserPresent){
            return res.status(200).json({
                message : "Welome Back Again",
                success : true,
            })
        }

        const dataToSave = new GoogleSchema(frontendData);
        dataToSave.save();
        return res.status(200).json({
            message : "user created succesfully",
            success : true
        })
    } catch (error) {
        console.log("erorr in google ctrl",error);
        res.status(400).json({
            message : "user data unable to save",
            success : false,
        })
        
    }
}
module.exports = GoogleSignup