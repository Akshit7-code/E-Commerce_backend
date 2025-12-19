const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

router.post("/admin/create", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.json({
        success: false,
        message: "Admin already created. You cannot create another one."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      email,
      otp: "",
      otpExpiry: 0
    });

    await newAdmin.save();

    return res.json({
      success: true,
      message: "Admin created successfully!",
      admin: {
        username: newAdmin.username,
        email: newAdmin.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// 📌 LOGIN
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne();
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }
    if (admin.username !== username) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    return res.json({ success: true, message: "Login successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// 📌 SEND OTP (Forgot Password)
router.post("/admin/forgot-password", async (req, res) => {
  const { email } = req.body;

  const admin = await Admin.findOne();

  if (!admin || admin.email !== email) {
    return res.json({ success: false, message: "Email not found" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiry = Date.now() + 1 * 60 * 1000;

  admin.otp = otp;
  admin.otpExpiry = expiry;
  await admin.save();

  // Send OTP email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: admin.email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 1 minute.`
  });

  res.json({ success: true, message: "OTP sent" ,eamil: admin.email});
});

// 📌 VERIFY OTP
router.post("/admin/verify-otp", async (req, res) => {
  const { otp } = req.body;

  const admin = await Admin.findOne();

  if (!admin || admin.otp !== otp) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  if (Date.now() > admin.otpExpiry) {
    return res.json({ success: false, message: "OTP expired" });
  }

  res.json({ success: true, message: "OTP verified" });
});

// 📌 UPDATE NEW USERNAME & PASSWORD
router.post("/admin/update-credentials", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.findOne();

  admin.username = username;
  admin.password = hashedPassword;
  admin.otp = null;
  admin.otpExpiry = null;

  await admin.save();

  res.json({ success: true, message: "Credentials updated" });
});

module.exports = router;
