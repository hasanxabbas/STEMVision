const { groq, gemini, provider } = require('../config');

/**
 * Generates a multiple-choice quiz based on a lesson's title and description.
 * @param {string} lessonTitle - The title of the lesson.
 * @param {string} lessonDescription - The description of the lesson.
 * @param {number} numberOfQuestions - The number of questions to generate (default 5).
 * @returns {Promise<Object>} - The JSON containing the "questions" array.
 */
async function generateQuiz(lessonTitle, lessonDescription, numberOfQuestions = 5) {
  const promptText = `You are an expert STEM educator. Generate a multiple-choice quiz of ${numberOfQuestions} questions based on the following lesson information:
Lesson Title: ${lessonTitle}
Lesson Description: ${lessonDescription}

Provide your response in JSON format. The JSON must follow this exact structure:
{
  "questions": [
    {
      "questionText": "The question text here...",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": "The exact string matching the correct option"
    }
  ]
}`;

  if (provider === 'gemini') {
    try {
      const model = gemini.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(promptText);
      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error in Gemini Quiz Service:', error);
      throw error;
    }
  } else {
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: promptText }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const contentText = response.choices[0].message.content;
      return JSON.parse(contentText);
    } catch (error) {
      console.error('Error in Groq Quiz Service:', error);
      throw error;
    }
  }
}

module.exports = {
  generateQuiz,
};
