const { required } = require('joi');
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    AdminEmail: { type: String, required: true, unique: true },
    AdminName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "Admin" },
    Department : {type:String,required : true}
});

const AdminModel = new mongoose.model("Admin", AdminSchema);

module.exports = AdminModel;
