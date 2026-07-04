const { analyzeImage } = require('./groq');

/**
 * Service to process an incoming image file buffer for STEM analysis.
 * @param {Buffer} fileBuffer - The uploaded image file buffer.
 * @param {string} mimeType - The MIME type of the image.
 * @param {string} category - The STEM category ('diagram', 'equation', 'graph', 'code', 'whiteboard').
 * @returns {Promise<Object>} - The parsed JSON analysis result from the AI model.
 */
async function processImageAnalysis(fileBuffer, mimeType, category) {
  if (!fileBuffer) {
    throw new Error('No image file provided.');
  }
  if (!category) {
    throw new Error('Analysis category is required.');
  }

  const base64Image = fileBuffer.toString('base64');
  
  // Delegate base64 analysis to the Groq service
  return await analyzeImage(base64Image, mimeType, category);
}

module.exports = {
  processImageAnalysis,
};
