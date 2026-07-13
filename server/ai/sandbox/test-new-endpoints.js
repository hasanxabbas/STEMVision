const fs = require('fs');
const path = require('path');
const { tutorController, quizController, visionController } = require('../../controllers/ai.controller');
const dotenv = require('dotenv');
dotenv.config();

// Create mock response
function createMockResponse(resolve, reject) {
  return {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      if (this.statusCode >= 400) {
        reject(new Error(`HTTP ${this.statusCode}: ${JSON.stringify(obj)}`));
      } else {
        resolve(obj);
      }
    }
  };
}

async function runTests() {
  console.log("=== RUNNING AI ENDPOINT VERIFICATION TESTS ===");
  console.log(`Active Provider: ${process.env.AI_PROVIDER || 'groq'}`);
  
  // 1. Test Tutor
  console.log("\nTesting tutorController...");
  const tutorPromise = new Promise((resolve, reject) => {
    const req = {
      body: {
        message: "Explain what gravity is in 2 sentences.",
        lessonContext: "Gravity is a fundamental force that pulls objects together."
      }
    };
    const res = createMockResponse(resolve, reject);
    tutorController(req, res);
  });

  try {
    const resObj = await tutorPromise;
    console.log("TUTOR SUCCESS:", resObj);
  } catch (err) {
    console.error("TUTOR FAILED:", err.message);
  }

  // 2. Test Quiz
  console.log("\nTesting quizController...");
  const quizPromise = new Promise((resolve, reject) => {
    const req = {
      body: {
        lessonId: null, // Test fallback behaviour when lesson is not in DB
        numberOfQuestions: 2
      }
    };
    const res = createMockResponse(resolve, reject);
    quizController(req, res);
  });

  try {
    const resObj = await quizPromise;
    console.log("QUIZ SUCCESS:", resObj);
  } catch (err) {
    console.error("QUIZ FAILED:", err.message);
  }

  // 3. Test Vision
  console.log("\nTesting visionController...");
  try {
    const imagePath = path.join(__dirname, '../../../client/src/assets/hero.png');
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Test image not found at ${imagePath}`);
    }
    const fileBuffer = fs.readFileSync(imagePath);
    
    const visionPromise = new Promise((resolve, reject) => {
      const req = {
        file: {
          buffer: fileBuffer,
          mimetype: 'image/png',
          originalname: 'hero.png'
        },
        body: {
          context: "Explain what is shown in this STEM logo/hero illustration."
        }
      };
      const res = createMockResponse(resolve, reject);
      visionController(req, res);
    });

    const resObj = await visionPromise;
    console.log("VISION SUCCESS:", resObj);
  } catch (err) {
    console.error("VISION FAILED:", err.message);
  }
}

runTests();
