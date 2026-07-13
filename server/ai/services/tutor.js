const { groq, gemini, provider } = require('../config');

/**
 * Generates a response from the AI tutor tailored for visually impaired students.
 * @param {string} message - The student's question/query.
 * @param {string|null} lessonContext - Optional text context from the lesson document.
 * @returns {Promise<string>} - The AI tutor's text response.
 */
async function getTutorResponse(message, lessonContext) {
  if (!message) {
    throw new Error('Message is required.');
  }

  const systemInstruction = `You are STEMVision, an empathetic, supportive, and extremely clear AI tutor for visually impaired STEM students.
Your job is to explain complex technical, scientific, mathematical, or engineering concepts step-by-step in an accessible way.
Avoid any purely visual references (like 'as shown in the red box' or 'look at the diagram above') unless you describe them in detail.
Keep your explanations structured and formatted in clean markdown.
${lessonContext ? `\nHere is context from the student's current lesson material:\n=== LESSON CONTEXT ===\n${lessonContext}\n======================` : ''}`;

  if (provider === 'gemini') {
    try {
      const model = gemini.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: systemInstruction,
      });
      const result = await model.generateContent(message);
      return result.response.text();
    } catch (error) {
      console.error('Error in Gemini Tutor Service:', error);
      throw error;
    }
  } else {
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error in Groq Tutor Service:', error);
      throw error;
    }
  }
}

module.exports = {
  getTutorResponse,
};
