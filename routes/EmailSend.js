const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { name, email, message, phoneNumber } = req.body;

  // Send response immediately
  res.status(200).json({ success: true, message: "Message received" });

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email in background (no waiting)
    transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: "Order Mail",
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    }).catch(err => console.log("Email Send Error:", err));

  } catch (error) {
    console.log("Background Email Error:", error);
  }
});

module.exports = router;
