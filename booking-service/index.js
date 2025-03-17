require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./models/db"); 

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/bookings", bookingRoutes);

// Sample route
app.get("/", (req, res) => {
    res.send({ message: "Service is running!" });
});

// Start the server
const PORT = process.env.PORT || 5001;

sequelize.sync({ alter: true }) 
    .then(() => {
        console.log("Database synchronized");
        app.listen(PORT, () => {
            console.log(`Booking Service Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1); 
    });
