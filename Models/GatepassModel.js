const mongoose = require("mongoose");
const { Schema } = mongoose;

// Gatepass Schema
const GatepassSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  exitTime: { type: Date, default: null },
  entryTime: { type: Date, default: null },
  firstQrExit: { type: Boolean, default: false }  // Toggles after each entry and exit
});

module.exports = mongoose.model("Gpass", GatepassSchema);
