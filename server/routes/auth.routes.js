const express = require("express");

const router = express.Router();

// Signup
router.post("/signup", (req, res) => {
    res.json({
        success: true,
        message: "Signup API is working"
    });
});

// Login
router.post("/login", (req, res) => {
    res.json({
        success: true,
        message: "Login API is working"
    });
});

// Get Profile
router.get("/profile", (req, res) => {
    res.json({
        success: true,
        message: "Profile API is working"
    });
});

// Update Profile
router.put("/profile", (req, res) => {
    res.json({
        success: true,
        message: "Update Profile API is working"
    });
});

module.exports = router;