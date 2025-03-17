const amqp = require("amqplib");
const Notification = require("./models/Notifications");
const nodemailer = require("nodemailer");
require("dotenv").config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Consume messages from RabbitMQ
const consumeMessages = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("booking_notifications");

        console.log("Waiting for messages...");
        channel.consume("booking_notifications", async (msg) => {
            if (msg !== null) {
                const { userEmail, message } = JSON.parse(msg.content.toString());

                try {
                    // Save notification to database
                    const notification = await Notification.create({ userEmail, message });

                    // Send email
                    await transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: userEmail,
                        subject: "Booking Confirmation",
                        text: message
                    });

                    // Update status
                    notification.status = "SENT";
                    await notification.save();

                    console.log(`Notification sent to ${userEmail}`);
                } catch (error) {
                    console.error("Error sending notification:", error);
                }

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("RabbitMQ Connection Error:", error);
    }
};

// Export the function to run in index.js
module.exports = consumeMessages;
