const { processImageAnalysis } = require('../ai/services/analyzer');
const AnalysisHistory = require('../models/AnalysisHistory');

/**
 * Controller to handle STEM image analysis requests.
 * POST /api/ai/analyze
 */
async function analyzeImageController(req, res) {
  try {
    const file = req.file;
    const { category, lessonId, fileUrl } = req.body;

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

    // Call service to run dynamic visual analysis
    const analysisResult = await processImageAnalysis(file.buffer, file.mimetype, category);

    // Determine the file URL to log (can be updated when integrated with file upload storage like Cloudinary)
    const activeFileUrl = fileUrl || (file ? file.originalname : undefined);

    // Log to AnalysisHistory collection
    try {
      const historyEntry = new AnalysisHistory({
        category,
        analysisResult,
        fileUrl: activeFileUrl,
        lessonId: lessonId || undefined,
        // userId: req.user?.id (to be hooked up when auth middleware is added)
      });
      await historyEntry.save();
    } catch (dbError) {
      console.warn('Database save warning (MongoDB connection might be uninitialized):', dbError.message);
    }

    // Standardized API response format
    return res.status(200).json({
      success: true,
      message: 'Analysis completed successfully',
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
