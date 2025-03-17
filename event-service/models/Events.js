const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    availableSeats: {
        type: Number,
        required: true,
        default: 100,
    },
    price: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
