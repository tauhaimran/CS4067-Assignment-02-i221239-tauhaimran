const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["SENT", "FAILED", "PENDING"],
        default: "PENDING",
    },
}, { timestamps: true });

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
