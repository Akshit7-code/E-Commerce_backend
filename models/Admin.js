const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  otp: String,
  otpExpiry: Number
});

module.exports = mongoose.model("Admin", AdminSchema,"adminDetail");
