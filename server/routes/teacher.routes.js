const express = require("express");

const router = express.Router();

// Get all teachers
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Get all teachers API is working"
    });
});

// Get teacher by ID
router.get("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Get teacher with ID ${req.params.id}`
    });
});

// Create a new teacher
router.post("/", (req, res) => {
    res.json({
        success: true,
        message: "Create teacher API is working"
    });
});

// Update teacher
router.put("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Update teacher with ID ${req.params.id}`
    });
});

// Delete teacher
router.delete("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Delete teacher with ID ${req.params.id}`
    });
});

module.exports = router;