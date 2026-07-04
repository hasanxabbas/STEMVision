const express = require("express");

const router = express.Router();

// Get all notifications
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Get all notifications API is working"
    });
});

// Get notification by ID
router.get("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Get notification with ID ${req.params.id}`
    });
});

// Create notification
router.post("/", (req, res) => {
    res.json({
        success: true,
        message: "Create notification API is working"
    });
});

// Mark notification as read
router.put("/:id/read", (req, res) => {
    res.json({
        success: true,
        message: `Notification ${req.params.id} marked as read`
    });
});

// Delete notification
router.delete("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Delete notification with ID ${req.params.id}`
    });
});

module.exports = router;