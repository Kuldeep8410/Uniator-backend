const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const AdministratorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "Administrator" },
  Entry_Qr: { type: [String], default: [] },
  Exit_Qr: { type: [String], default: [] } 
});

//insert an user to 



//middleware
AdministratorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});




const AdministratorModel = mongoose.model("Administrator", AdministratorSchema);

// const doc = new AdministratorModel({
//     email : "gk022135@gmail.com",
//     password : "e19pb2111048",
//     role : "Administrator"
// })
// doc.save();


module.exports = AdministratorModel;
