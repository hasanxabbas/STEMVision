const fs = require('fs');
const path = require('path');
const { analyzeImage } = require('../services/groq');

// Load environment variables locally
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Tiny 2x2 transparent PNG base64 representation for basic connectivity check (Llama 4 requires >= 2x2 pixels)
const MOCK_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQIW2M8f/48AwEYg4iICAAAdQIQc5D9H+4AAAAASUVORK5CYII=';

async function runTest() {
  const args = process.argv.slice(2);
  let base64Image = MOCK_PNG_BASE64;
  let mimeType = 'image/png';
  let category = 'equation'; // default category

  if (args.length > 0) {
    const filePath = args[0];
    if (args[1]) {
      category = args[1];
    }

    console.log(`Loading local image file: ${filePath}`);
    try {
      const absolutePath = path.resolve(filePath);
      const fileBuffer = fs.readFileSync(absolutePath);
      base64Image = fileBuffer.toString('base64');

      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        mimeType = 'image/jpeg';
      } else if (ext === '.png') {
        mimeType = 'image/png';
      } else {
        console.warn(`Unknown image extension ${ext}, defaulting MIME type to image/png.`);
      }
    } catch (err) {
      console.error(`Failed to read file ${filePath}:`, err.message);
      console.log('Falling back to a 2x2 mock transparent PNG for connection test...');
    }
  } else {
    console.log('No local image file path provided as CLI argument.');
    console.log('Using a 2x2 mock transparent PNG to run a basic connection and API key test.');
  }

  console.log(`Running analysis using category: "${category}"...`);
  try {
    const result = await analyzeImage(base64Image, mimeType, category);
    console.log('\n--- SUCCESS: API Response received ---');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('\n--- FAILURE: Test encountered an error ---');
    console.error(error.message);
    process.exit(1);
  }
}

runTest();
