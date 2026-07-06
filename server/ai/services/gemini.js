const { gemini } = require('../config');
const prompts = require('../prompts');

/**
 * Analyzes a base64-encoded image using the Gemini 1.5 Flash model.
 * @param {string} base64Image - The image data encoded in base64.
 * @param {string} mimeType - The MIME type of the image.
 * @param {string} category - The STEM category ('diagram', 'equation', 'graph', 'code', 'whiteboard').
 * @returns {Promise<Object>} - The parsed JSON analysis result.
 */
async function analyzeImage(base64Image, mimeType, category) {
  const promptText = prompts[category];
  if (!promptText) {
    throw new Error(`Unsupported category: ${category}`);
  }

  if (!gemini) {
    throw new Error('Gemini client is not configured. Please set the GEMINI_API_KEY environment variable.');
  }

  try {
    const model = gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([promptText, imagePart]);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error calling Gemini Vision API:', error);
    throw error;
  }
}

module.exports = {
  analyzeImage,
};
