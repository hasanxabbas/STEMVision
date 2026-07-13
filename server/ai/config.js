const { Groq } = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const provider = process.env.AI_PROVIDER || 'groq';

// Initialize Groq Client
const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey && provider === 'groq') {
  console.warn('WARNING: GROQ_API_KEY environment variable is not defined.');
}
const groq = new Groq({
  apiKey: groqApiKey || 'dummy-key-for-initialization',
});

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey && provider === 'gemini') {
  console.warn('WARNING: GEMINI_API_KEY environment variable is not defined.');
}
const gemini = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

module.exports = {
  groq,
  gemini,
  provider,
};
