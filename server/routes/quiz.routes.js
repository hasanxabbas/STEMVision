const express = require("express");

const router = express.Router();

// Get all quizzes
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Get all quizzes API is working"
    });
});

// Get quiz by ID
router.get("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Get quiz with ID ${req.params.id}`
    });
});

// Create a new quiz
router.post("/", (req, res) => {
    res.json({
        success: true,
        message: "Create quiz API is working"
    });
});

// Update quiz
router.put("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Update quiz with ID ${req.params.id}`
    });
});

// Delete quiz
router.delete("/:id", (req, res) => {
    res.json({
        success: true,
        message: `Delete quiz with ID ${req.params.id}`
    });
});

module.exports = router;