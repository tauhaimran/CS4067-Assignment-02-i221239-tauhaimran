const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB - Notification Service"))
    .catch(err => console.log("MongoDB connection error:", err));

module.exports = mongoose;
