require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("./models/db");
const notificationRoutes = require("./routes/notificationRoutes");
const consumeMessages = require("./rabbitmq"); // Import RabbitMQ Consumer

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/notifications", notificationRoutes);

// Start server after MongoDB connection
const PORT = process.env.PORT || 5003;
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB - Notification Service");
    
    // Start consuming RabbitMQ messages
    consumeMessages();

    app.listen(PORT, () => {
        console.log(`Notification Service running on port ${PORT}`);
    });
});
