const express = require("express");

const router = express.Router();

// Get all students
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Get all students API is working"
    });
});

// Get student by ID
router.get("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Get student with ID ${req.params.id}`
    });
});

// Create a new student
router.post("/", (req, res) => {
    res.json({
        success: true,
        message: "Create student API is working"
    });
});

// Update student
router.put("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Update student with ID ${req.params.id}`
    });
});

// Delete student
router.delete("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Delete student with ID ${req.params.id}`
    });
});

module.exports = router;