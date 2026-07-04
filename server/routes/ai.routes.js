const express = require("express");

const router = express.Router();

// AI Vision - Explain diagrams/images
router.post("/vision", (req, res) => {
    res.json({
        success: true,
        message: "AI Vision API is working"
    });
});

// AI Tutor - Answer student questions
router.post("/tutor", (req, res) => {
    res.json({
        success: true,
        message: "AI Tutor API is working"
    });
});

// AI Quiz Generator
router.post("/quiz", (req, res) => {
    res.json({
        success: true,
        message: "AI Quiz Generator API is working"
    });
});

// AI Text-to-Speech
router.post("/speech", (req, res) => {
    res.json({
        success: true,
        message: "AI Text-to-Speech API is working"
    });
});

module.exports = router;