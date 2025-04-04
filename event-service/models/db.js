const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_URL)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Error: " + err));

module.exports = mongoose;
