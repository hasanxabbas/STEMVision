# STEMVision - AI & Accessibility Developer Handoff Guide
> **Author:** AI & Accessibility Developer  
> **Status:** Iterations 1, 2, and 3 Completed, Reviewed, and Locally Committed  
> **Target Branch:** `feature/ai` (to be merged into `develop`)  

This document serves as a complete technical brief and integration guide for the **Project Lead**, **Backend Developer**, **Database Developer**, and **Frontend Developer** to understand the implemented AI features, folder structures, and how to connect their modules to the accessibility foundation.

---

## 1. Executive Summary & Architecture

The AI module for STEMVision enables visually impaired students to interpret complex technical content (diagrams, equations, graphs, code screenshots, and whiteboard notes) through structured text summaries and audio guidance. 

### Pluggable AI Provider Configuration
The codebase is designed with a configuration layer supporting multiple inference APIs. By setting `AI_PROVIDER` in your environment, you can switch between **Groq** (using Llama 4 Scout) and **Google Gemini** (using Gemini 1.5 Flash).
* **Groq:** Selected for ultra-low latency response times (ideal for screen-reader TTS fluidity).
* **Gemini:** Selected for larger context windows and general-purpose reasoning.

Both providers return identical structured JSON response formats, making them fully transparent to the frontend client.

```text
[React UI Component]  <─── (TTS Speech & Voice Commands) ───> [AccessibilityContext]
       │
       ▼ (1. Upload File + Category + optional lessonId)
[Express Server (server.js)]
       │
       ▼ (2. Multer Memory Upload Buffer)
[AI Controller (ai.controller.js)]
       │
       ▼ (3. Map Category Prompts & Check AI_PROVIDER)
[Analyzer Service (analyzer.js)]
       │
       ├─► [Groq Service (groq.js)] ──► Llama 4 Scout (meta-llama/llama-4-scout-17b-16e-instruct)
       │         OR
       ├─► [Gemini Service (gemini.js)] ──► Gemini 1.5 Flash
       │
       ▼ (4. Save Log) ──► [Database: AnalysisHistory Schema]
       │
       ▼ (5. Send Standardized JSON response)
[React UI Response]
```

---

## 2. File & Folder Architecture

All AI-specific code resides in the dedicated directories, in alignment with the team's repository boundaries:

```text
STEMVision/
├── client/
│   src/
│   ├── components/
│   │   └── AIExplanationCard.jsx       # Reusable analyzer UI card component
│   ├── context/
│   │   └── AccessibilityContext.jsx    # React Context managing TTS, STT, and Contrast
│   └── services/
│       ├── api.js                      # Base API endpoint selector
│       └── ai.service.js               # Client fetcher sending images to backend
│
└── server/
    ├── .env.example                    # Template for environment variables
    ├── controllers/
    │   └── ai.controller.js            # Express controller parsing requests & logging history
    ├── models/
    │   └── AnalysisHistory.js          # Mongoose model schema for database history logging
    ├── routes/
    │   └── ai.routes.js                # Express router mapping /analyze with multer buffers
    └── ai/
        ├── config.js                   # Client instance selector (Groq and Gemini)
        ├── prompts.js                  # Markdown system prompt templates returning JSON
        ├── services/
        │   ├── groq.js                 # Low-level Groq completions handler
        │   ├── gemini.js               # Low-level Gemini completions handler
        │   └── analyzer.js             # Unified dispatch service checking AI_PROVIDER
        └── sandbox/
            └── test-groq.js            # Command-line test utility for testing connectivity
```

---

## 3. Dependency Configurations

### Server Dependencies
The following npm packages were added to the `server/package.json`:
* **`groq-sdk`**: Handles connection to Groq API services.
* **`@google/generative-ai`**: Handles connection to Google Gemini API services.
* **`dotenv`**: Loads environment variables from the `.env` file.
* **`multer`**: Manages multipart/form-data upload streams directly into memory buffers.

### Client Dependencies
The frontend utilizes native HTML5 browser APIs, requiring **zero extra dependencies** to avoid bloated packages:
* **Web Speech Synthesis API** for Text-to-Speech (TTS).
* **Web Speech Recognition API** (`webkitSpeechRecognition`) for hands-free voice command interpretation.

---

## 4. Team Integration Guide

### 🧑‍💻 For the Backend Developer
The routes and controller configurations are registered under `/api/ai` in `server/server.js`.

* **Endpoint:** `POST /api/ai/analyze`
* **Content-Type:** `multipart/form-data`
* **Request Parameters:**
  * `image` (binary file): The uploaded screenshot/file payload.
  * `category` (string, body): Must be one of: `'diagram'`, `'equation'`, `'graph'`, `'code'`, or `'whiteboard'`.
  * `lessonId` (string, body, optional): The ID of the related Lesson document from which this analysis originated.
  * `fileUrl` (string, body, optional): The direct URL to the file if pre-uploaded to a cloud store.
* **Standardized Response Format:**
  All responses return in the standard backend envelope structure:
  ```json
  {
    "success": true,
    "message": "Analysis completed successfully",
    "data": {
      // Category-specific structured JSON content
    }
  }
  ```

---

### 🗄️ For the Database Developer
The AI logging schema is implemented inside `server/models/AnalysisHistory.js`.

* **Model Schema properties:**
  ```javascript
  const AnalysisHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: false }, // Links analysis to a lesson
    category: { type: String, enum: ['diagram', 'equation', 'graph', 'code', 'whiteboard'], required: true },
    fileUrl: { type: String, required: false }, // Stores URL path of the analyzed document/image (renamed from imageUrl)
    analysisResult: { type: mongoose.Schema.Types.Mixed, required: true }, // Structured JSON from LLM
    createdAt: { type: Date, default: Date.now }
  });
  ```

---

### 🎨 For the Frontend Developer
I have created the hook contexts and UI cards. To display and run the analyzer, complete these two integrations:

#### 1. Wrap the Application in the Provider
Inside `client/src/main.jsx`, wrap the root `<App />` component in the `<AccessibilityProvider>`:
```javascript
import { AccessibilityProvider } from './context/AccessibilityContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  </StrictMode>
);
```

#### 2. Render the AI Analyzer Component
Import and render `<AIExplanationCard />` inside any dashboard or page page:
```javascript
import { AIExplanationCard } from '../components/AIExplanationCard';

// Inside your screen:
<AIExplanationCard category="equation" />
```

#### 3. High-Contrast Styles
The provider automatically adds a `.high-contrast-mode` class wrapper to the base container. You can add styling tokens in `index.css` or component files to invert backgrounds to black and text to yellow/white for low-vision users:
```css
.high-contrast-mode {
  background-color: #000000 !important;
  color: #ffffff !important;
}
.high-contrast-mode button {
  background-color: #ffeb3b !important;
  color: #000000 !important;
}
```

---

## 5. Local Setup & Testing

### Environment Configuration
Create a `.env` file in the `server/` directory:
```text
# Provider selection: groq OR gemini
AI_PROVIDER=groq

# API keys
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

PORT=5000
```

### Running CLI Connection Tests
You can run an offline test on the Groq API from the `server/` folder using the sandbox utility script:
* **Test with Real Image:**
  ```bash
  node ai/sandbox/test-groq.js ../client/src/assets/hero.png
  ```

### Starting the Server
Start your dev server:
```bash
npm run dev
```
The server will boot on port `5000`. You can send POST payloads to `http://localhost:5000/api/ai/analyze` using Postman or our React front-end services.
