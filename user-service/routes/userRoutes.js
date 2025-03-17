const express = require("express");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();


router.get("/", (req, res) => {
    res.json({ message: "User Service is working!" });
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error("[User Service] Error fetching user:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, type } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // Create user
        const newUser = await User.create({ name, email, password, type });

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("[User Service] Error during signup:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ error: "User not found" });

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, type: user.type },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });
    } catch (error) {
        console.error("[User Service] Error during login:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
