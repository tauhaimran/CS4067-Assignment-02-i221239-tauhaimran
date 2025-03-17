require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("./models/db"); // Add MongoDB connection

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const eventRoutes = require("./routes/eventRoutes");
app.use("/events", eventRoutes);

const clearDatabase = async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({}); // Clears all documents
    }

    console.log("Database cleared!");
};

// Sample route
app.get("/", (req, res) => {
    res.send({ message: "Event Service is running!" });
});

// Start the server after database connection
const PORT = process.env.PORT || 5002;
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB - Event Service");
    app.listen(PORT, () => {
        console.log(`Event Service running on port ${PORT}`);
    });
    // clearDatabase();
});

