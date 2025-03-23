const UserModel = require("../Models/UserSchema");
const GatepassModel = require("../Models/GatepassModel");
const AdminModel = require("../Models/AdminModel"); // Assuming AdminModel is used
const Adminstrator = require("../Models/AminstratorModel")

async function QrvarificationG1G2(req, res) {
  try {
    const { qrvalue, email } = req.query;
    console.log("QR details:", req.query);

    if (!qrvalue || !email) {
      return res.status(400).json({
        message: "Missing email or wrong QR scanned",
        success: false,
      });
    }

    const qrPrefix = qrvalue.substring(0, 4).toUpperCase(); // Fix function name
    const adminData = await Adminstrator.find().select("Entry_Qr Exit_Qr");




    if (!adminData) {
      console.log("value check hua ")
      return res.status(400).json({
        message: "error in fetching Db Qr",
        success: false,
      });
    }

    //checking qr is match or not
    const isValidQr = adminData.some(admin => admin.Entry_Qr === qrvalue || admin.Exit_Qr === "Exit420");
    if (isValidQr) {
      console.log("wron qr hi")
      return res.status(400).json({
        message: "Wrong QR code",
        success: false,
      });
    }


//checking user is Genuine or Not
    const userPresent = await UserModel.findOne({ email });
    if (!userPresent) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
      });
    }

//taking user Schema is for saving in Gpass model for Better Acesss of data
    const userID = userPresent._id;
    const timing = new Date().toISOString(); // Fix incorrect Date.now()


// Get the latest gatepass record
    const lastGatePass = await GatepassModel.findOne({ userId: userID }).sort({ _id: -1 });


//applying validtion for user that he make sure that he made exit first form gate 
    if (qrPrefix === "EXIT") {
      if (!lastGatePass || lastGatePass.firstQrExit === false) {
        // Allow exit only if last entry exists and firstQrExit is false
        const newExit = new GatepassModel({
          userId: userID,
          exitTime: timing,
          firstQrExit: true,
        });

        await newExit.save();
        return res.status(200).json({
          message: "Exit recorded successfully.",
          success: true,
          direction: "Now you Can go Outside of University"
        });
      } else {
        return res.status(400).json({
          message: "You have already exited. Please enter first.",
          success: false,
        });
      }
    }



// allow entry if user previously make an exit from gate then he will allow for entry
    if (qrPrefix === "ENTR") {
      if (lastGatePass && lastGatePass.firstQrExit === true) {
        // Allow entry only if last exit exists and firstQrExit is true
        const newEntry = new GatepassModel({
          userId: userID,
          entryTime: timing,
          firstQrExit: false,
        });

        await newEntry.save();
        return res.status(200).json({
          message: "Entry recorded successfully .",
          success: true,
          direction: "come inside University"
        });
      } else {
        return res.status(400).json({
          message: "You must exit first before making a new entry.",
          success: false,
        });
      }
    }



//after all of these sending response   
    return res.status(400).json({
      message: "Invalid QR code type.",
      success: false,
    });


// catching error 
  } catch (error) {
    console.error("Error in making entry/exit:", error);
    return res.status(500).json({
      message: "Server-side error",
      success: false,
    });
  }
}

module.exports = QrvarificationG1G2;


//testing not done for it 

