const express = require("express");

const router = express.Router();

// Get all lessons
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Get all lessons API is working"
    });
});

// Get lesson by ID
router.get("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Get lesson with ID ${req.params.id}`
    });
});

// Create a new lesson
router.post("/", (req, res) => {
    res.json({
        success: true,
        message: "Create lesson API is working"
    });
});

// Update lesson
router.put("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Update lesson with ID ${req.params.id}`
    });
});

// Delete lesson
router.delete("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Delete lesson with ID ${req.params.id}`
    });
});

module.exports = router;