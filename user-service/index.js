require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./models/db"); 

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// Sample route
app.get("/", (req, res) => {
    res.send({ message: "Service is running!" });
});

// Sync Database and Start Server
const PORT = process.env.PORT || 5004;

sequelize.sync({ alter: true }) 
    .then(() => {
        console.log("Database synchronized");
        app.listen(PORT, () => {
            console.log(`User Service is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1); 
    });
