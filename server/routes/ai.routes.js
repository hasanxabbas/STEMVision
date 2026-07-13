const express = require('express');
const multer = require('multer');
const {
  tutorController,
  visionController,
  quizController,
  speechController,
  analyzeImageController,
} = require('../controllers/ai.controller');

const router = express.Router();

// Configure memory storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB limit
  },
});

// AI Tutor - Chat concept assistant
router.post('/tutor', tutorController);

// AI Vision - Explain diagrams/images (expects multipart/form-data with "image" file)
router.post('/vision', upload.single('image'), visionController);

// AI Quiz Generator
router.post('/quiz', quizController);

// AI Text-to-Speech placeholder
router.post('/speech', speechController);

// Legacy AI Visual analysis endpoint compatibility
router.post('/analyze', upload.single('image'), analyzeImageController);

module.exports = router;
