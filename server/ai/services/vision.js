const { groq, gemini, provider } = require('../config');

/**
 * Analyzes a STEM image and context to return a description and summary suitable for accessibility.
 * @param {string} base64Image - Base64 encoded image content.
 * @param {string} mimeType - Image MIME type.
 * @param {string|null} context - Optional user-provided context.
 * @returns {Promise<Object>} - The JSON containing "description" and "summary".
 */
async function analyzeVision(base64Image, mimeType, context) {
  const promptText = `You are an expert STEM educator specializing in accessibility. Analyze the uploaded image.
Provide your response in JSON format. The JSON must follow this exact structure:
{
  "description": "A detailed, step-by-step description of its technical details, mathematical formulas, nodes, lines, trends, or text in the image, tailored for a screen reader.",
  "summary": "A concise, high-level pedagogical takeaway summarizing what this visual material represents."
}
${context ? `\nAdditional student context or query: "${context}"` : ''}`;

  if (provider === 'gemini') {
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
      console.error('Error in Gemini Vision Service:', error);
      throw error;
    }
  } else {
    try {
      const response = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
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
      console.error('Error in Groq Vision Service:', error);
      throw error;
    }
  }
}

module.exports = {
  analyzeVision,
};
