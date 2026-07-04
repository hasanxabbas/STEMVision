const groq = require('../config');
const prompts = require('../prompts');

/**
 * Analyzes a base64-encoded image using the Groq Llama 3 Vision model.
 * @param {string} base64Image - The image data encoded in base64.
 * @param {string} mimeType - The mime type of the image (e.g. image/png, image/jpeg).
 * @param {string} category - The STEM category ('diagram', 'equation', 'graph', 'code', 'whiteboard').
 * @returns {Promise<Object>} - The structured JSON response parsed into an object.
 */
async function analyzeImage(base64Image, mimeType, category) {
  const promptText = prompts[category];
  if (!promptText) {
    throw new Error(`Unsupported category: ${category}`);
  }

  // Ensure Groq is configured before attempting the call
  if (groq.apiKey === 'dummy-key-for-initialization') {
    throw new Error('Groq client is not configured. Please set the GROQ_API_KEY environment variable.');
  }

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: promptText },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const contentText = response.choices[0].message.content;
    return JSON.parse(contentText);
  } catch (error) {
    console.error('Error calling Groq Vision API:', error);
    throw error;
  }
}

module.exports = {
  analyzeImage,
};
