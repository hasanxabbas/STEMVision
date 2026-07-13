const { getTutorResponse } = require('../ai/services/tutor');
const { analyzeVision } = require('../ai/services/vision');
const { generateQuiz } = require('../ai/services/quiz');
const { processImageAnalysis } = require('../ai/services/analyzer');
const AnalysisHistory = require('../models/AnalysisHistory');
const Lesson = require('../models/Lesson');

/**
 * AI Tutor - Chat concept assistant
 * POST /api/ai/tutor
 */
async function tutorController(req, res) {
  try {
    const { message, lessonContext } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message parameter is required.',
      });
    }

    const answer = await getTutorResponse(message, lessonContext);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('Error in tutorController:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve AI Tutor response.',
      error: error.message,
    });
  }
}

/**
 * AI Vision - Analyze uploaded diagram/equation/graph/code/whiteboard
 * POST /api/ai/vision
 */
async function visionController(req, res) {
  try {
    const file = req.file;
    const { context, lessonId } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please upload a file using the "image" field.',
      });
    }

    const base64Image = file.buffer.toString('base64');
    const analysisResult = await analyzeVision(base64Image, file.mimetype, context);

    // Save to AnalysisHistory database log
    try {
      const historyEntry = new AnalysisHistory({
        category: 'diagram', // Default general category
        analysisResult,
        fileUrl: file.originalname,
        lessonId: lessonId || undefined,
      });
      await historyEntry.save();
    } catch (dbError) {
      console.warn('Database save warning (MongoDB connection might be uninitialized):', dbError.message);
    }

    return res.status(200).json({
      success: true,
      description: analysisResult.description,
      summary: analysisResult.summary,
    });
  } catch (error) {
    console.error('Error in visionController:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete AI Vision analysis.',
      error: error.message,
    });
  }
}

/**
 * AI Quiz - Generate multiple-choice quiz questions based on lesson content
 * POST /api/ai/quiz
 */
async function quizController(req, res) {
  try {
    const { lessonId, numberOfQuestions } = req.body;

    let lessonTitle = 'General STEM Study Guide';
    let lessonDescription = 'Self-study questionnaire';

    // Retrieve lesson info from DB if it exists
    if (lessonId) {
      try {
        const lesson = await Lesson.findById(lessonId);
        if (lesson) {
          lessonTitle = lesson.title;
          lessonDescription = lesson.description || lesson.title;
        }
      } catch (dbError) {
        console.warn('Could not query Lesson collection from DB, using defaults:', dbError.message);
      }
    }

    const quizResult = await generateQuiz(lessonTitle, lessonDescription, numberOfQuestions || 5);

    return res.status(200).json({
      success: true,
      questions: quizResult.questions || [],
    });
  } catch (error) {
    console.error('Error in quizController:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate quiz.',
      error: error.message,
    });
  }
}

/**
 * AI Text-to-Speech - Server-side TTS endpoint placeholder
 * POST /api/ai/speech
 */
async function speechController(req, res) {
  try {
    return res.status(200).json({
      success: true,
      message: 'AI Text-to-Speech API placeholder is working. Note: Client uses Web Speech API.',
    });
  } catch (error) {
    console.error('Error in speechController:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process speech endpoint.',
      error: error.message,
    });
  }
}

/**
 * Analyze Image (Legacy route compatibility)
 * POST /api/ai/analyze
 */
async function analyzeImageController(req, res) {
  try {
    const file = req.file;
    const { category, lessonId, fileUrl } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded.',
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category parameter is required.',
      });
    }

    const analysisResult = await processImageAnalysis(file.buffer, file.mimetype, category);
    const activeFileUrl = fileUrl || (file ? file.originalname : undefined);

    try {
      const historyEntry = new AnalysisHistory({
        category,
        analysisResult,
        fileUrl: activeFileUrl,
        lessonId: lessonId || undefined,
      });
      await historyEntry.save();
    } catch (dbError) {
      console.warn('Database save warning:', dbError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Analysis completed successfully',
      data: analysisResult,
    });
  } catch (error) {
    console.error('Error in legacy analyzeImageController:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete STEM analysis.',
      error: error.message,
    });
  }
}

module.exports = {
  tutorController,
  visionController,
  quizController,
  speechController,
  analyzeImageController,
};
