const express = require("express");

const router = express.Router();

// Get all subjects
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Get all subjects API is working"
    });
});

// Get subject by ID
router.get("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Get subject with ID ${req.params.id}`
    });
});

// Create a new subject
router.post("/", (req, res) => {
    res.json({
        success: true,
        message: "Create subject API is working"
    });
});

// Update subject
router.put("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Update subject with ID ${req.params.id}`
    });
});

// Delete subject
router.delete("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Delete subject with ID ${req.params.id}`
    });
});

module.exports = router;