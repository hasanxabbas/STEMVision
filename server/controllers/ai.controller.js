const { processImageAnalysis } = require('../ai/services/analyzer');
const ChatHistory = require('../models/ChatHistory');

/**
 * Controller to handle STEM image analysis requests.
 * POST /api/ai/analyze
 */
async function analyzeImageController(req, res) {
  try {
    const file = req.file;
    const { category } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please upload an image file.',
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category parameter is required (diagram, equation, graph, code, whiteboard).',
      });
    }

    // Call service to run Llama 4 Scout visual analysis
    const analysisResult = await processImageAnalysis(file.buffer, file.mimetype, category);

    // Log to analysis/chat history
    try {
      const historyEntry = new ChatHistory({
        category,
        analysisResult,
        // userId: req.user?.id (to be hooked up when auth middleware is added)
      });
      await historyEntry.save();
    } catch (dbError) {
      console.warn('Database save warning (MongoDB connection might be uninitialized):', dbError.message);
    }

    return res.status(200).json({
      success: true,
      category,
      data: analysisResult,
    });
  } catch (error) {
    console.error('Error in analyzeImageController:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete STEM analysis.',
      error: error.message,
    });
  }
}

module.exports = {
  analyzeImageController,
};
