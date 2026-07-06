const { provider } = require('../config');
const groqService = require('./groq');
const geminiService = require('./gemini');

/**
 * Service to process an incoming image file buffer for STEM analysis.
 * @param {Buffer} fileBuffer - The uploaded image file buffer.
 * @param {string} mimeType - The MIME type of the image.
 * @param {string} category - The STEM category ('diagram', 'equation', 'graph', 'code', 'whiteboard').
 * @returns {Promise<Object>} - The parsed JSON analysis result from the active AI provider.
 */
async function processImageAnalysis(fileBuffer, mimeType, category) {
  if (!fileBuffer) {
    throw new Error('No image file provided.');
  }
  if (!category) {
    throw new Error('Analysis category is required.');
  }

  const base64Image = fileBuffer.toString('base64');
  
  if (provider === 'gemini') {
    console.log('Using Gemini API (gemini-1.5-flash) for STEM visual analysis.');
    return await geminiService.analyzeImage(base64Image, mimeType, category);
  } else {
    console.log('Using Groq API (meta-llama/llama-4-scout-17b-16e-instruct) for STEM visual analysis.');
    return await groqService.analyzeImage(base64Image, mimeType, category);
  }
}

module.exports = {
  processImageAnalysis,
};
