const express = require('express');
const multer = require('multer');
const { analyzeImageController } = require('../controllers/ai.controller');

const router = express.Router();

// Use memory storage so we get the file buffer directly in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB limit (matching Groq's maximum base64 payload size)
  },
});

// Endpoint POST /api/ai/analyze
router.post('/analyze', upload.single('image'), analyzeImageController);

module.exports = router;
