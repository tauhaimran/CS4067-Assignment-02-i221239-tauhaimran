const express = require("express");
const router = express.Router();
const Notification = require("../models/Notifications");
const nodemailer = require("nodemailer");

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Send Notification
const sendNotification = async (req, res) => {
    try {
        const { userEmail, message } = req.body;

        // Store notification in database
        const notification = await Notification.create({ userEmail, message });
        console.log(`[${new Date().toISOString()}] Creating notification for ${userEmail}`);

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Booking Confirmation", 
            text: message
        });
        console.log(`[${new Date().toISOString()}] Email sent to ${userEmail}`);

        // Update status
        notification.status = "SENT";
        await notification.save();
        console.log(`[${new Date().toISOString()}] Notification status updated to SENT for ${userEmail}`);

        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error sending notification: ${error.message}`);
        res.status(500).json({ error: "Failed to send notification" });
    }
};

router.post("/", sendNotification);

module.exports = router;
