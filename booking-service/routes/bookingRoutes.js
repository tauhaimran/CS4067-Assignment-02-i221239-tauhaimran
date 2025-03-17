const express = require("express");
const Booking = require("../models/Bookings");
const router = express.Router();
const amqp = require("amqplib");
const axios = require("axios"); 

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

// Function to send a message to RabbitMQ
const sendNotification = async (userEmail, message) => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("booking_notifications");

        const notification = { userEmail, message };
        channel.sendToQueue("booking_notifications", Buffer.from(JSON.stringify(notification)));

        console.log(`[Notification Service] Message sent to ${userEmail}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("[RabbitMQ Error]", error.message);
    }
};

router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        console.log("[GET] Retrieved all bookings successfully");
        res.status(200).json(bookings);
    } catch (error) {
        console.error("[Server Error]", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { userId, eventId, numTickets } = req.body;

        // Validate input
        if (!userId || !eventId || !numTickets) {
            console.log("[Validation Error] Missing required booking fields");
            return res.status(400).json({ error: "Missing required fields" });
        }

        const userResponse = await axios.get(`http://localhost:5004/users/${userId}`);
        if (!userResponse.data) {
            console.log("[Validation Error] Invalid user ID:", userId);
            return res.status(400).json({ error: "Invalid user ID" });
        }
        
        const eventResponse = await axios.get(`http://localhost:5002/events/${eventId}`);
        if (!eventResponse.data) {
            console.log("[Validation Error] Invalid event ID:", eventId);
            return res.status(400).json({ error: "Invalid event ID" });
        }

        const newBooking = new Booking({
            userId,
            eventId,
            numTickets,
            bookingDate: new Date(),
        });

        const event = eventResponse.data;
        const userEmail = userResponse.data.email;
        const message = `
        Your booking for event: **${event.title}** is confirmed! 🎉
        
         **Event Details:**
        ---------------------------------
         **Event Name:** ${event.title}
         **Event Date:** ${new Date(event.date).toLocaleDateString()}
         **Location:** ${event.location}
         **Tickets:** ${numTickets}
         **Total Price:** $${event.price * numTickets}
         **Booking Date:** ${new Date().toLocaleString()}
        
        Thank you for using our service!
        `;
        
        await sendNotification(userEmail, message);
        await newBooking.save();
        
        console.log("[POST] New booking created successfully for user:", userId);
        res.status(201).json({ booking: newBooking, message: "Booking created successfully" });
    } catch (error) {
        console.error("[Server Error]", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const bookingId = req.params.id;

        if (!bookingId) {
            console.log("[Validation Error] Missing booking ID");
            return res.status(400).json({ error: "Missing booking ID" });
        }

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            console.log("[Not Found Error] Booking not found:", bookingId);
            return res.status(404).json({ error: "Booking not found" });
        }

        await booking.destroy();
        console.log("[DELETE] Booking deleted successfully:", bookingId);
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error("[Server Error]", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { numTickets } = req.body;

        if (!numTickets) {
            console.log("[Validation Error] Missing required update fields");
            return res.status(400).json({ error: "Missing required fields" });
        }

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            console.log("[Not Found Error] Booking not found:", bookingId);
            return res.status(404).json({ error: "Booking not found" });
        }

        booking.numTickets = numTickets;
        await booking.save();

        console.log("[PUT] Booking updated successfully:", bookingId);
        res.status(200).json({ booking, message: "Booking updated successfully" });
    } catch (error) {
        console.error("[Server Error]", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
