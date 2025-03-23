const usermodel = require('../Models/UserSchema')
const userG_model = require('../Models/UserGoogle')

function Qr_varifi(req, res){
    try {
        const qrData =req.body;
        console.log("here is qr data",qrData)

        const isUserPresent = usermodel.findOne({email : qrData.email})
        const isUserGoogle = userG_model.findOne({email: qrData.email})

        if(isUserGoogle || isUserPresent){
            // user present hai
            // make user entry in gatepass model with time and user model obj id:- _id
            

        }
        if(!isUserGoogle && !isUserPresent){
            //user does not exists
            return res.status(400).json({
                message : "user does not exists",
                success : false
            })
        }
        
    } catch (error) {
        
    }

}
module.exports = Qr_varifi;