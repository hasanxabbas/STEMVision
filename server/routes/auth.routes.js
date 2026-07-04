const express = require("express");
const router = express.Router();

const {
  signup,
  login,
} = require("../controllers/auth.controller");

const verifyToken = require("../middleware/auth.middleware");

// ====================
// Authentication Routes
// ====================

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

// ====================
// Protected Profile Routes
// ====================

// Get Profile
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
});

// Update Profile
router.put("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: req.user,
  });
});

module.exports = router;