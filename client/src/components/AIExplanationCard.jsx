import React, { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { analyzeSTEMContent } from '../services/ai.service';

/**
 * Reusable STEMVision AI Explanation Card component with integrated TTS/STT accessibility controls.
 */
export const AIExplanationCard = ({ category: initialCategory }) => {
  const {
    speak,
    stopSpeaking,
    isSpeaking,
    isListening,
    startListening,
    stopListening,
    highContrast,
  } = useAccessibility();

  const [category, setCategory] = useState(initialCategory || 'equation');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Focus management reference
  const resultRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image file to analyze.');
      speak('Please select an image file to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    speak('Analyzing image, please wait...');

    try {
      const response = await analyzeSTEMContent(selectedFile, category);
      if (response.success && response.data) {
        setAnalysisResult(response.data);
        
        let textToSpeak = '';
        if (category === 'equation') {
          textToSpeak = `Analysis complete. The equation is spoken as: ${response.data.spokenRepresentation}. Explanation: ${response.data.explanation}`;
        } else if (category === 'diagram') {
          textToSpeak = `Analysis complete. Diagram summary: ${response.data.summary}. Suggested reading order is: ${response.data.readingOrder}`;
        } else if (category === 'graph') {
          textToSpeak = `Analysis complete. Graph title is: ${response.data.title}. Trend: ${response.data.trendAnalysis}`;
        } else if (category === 'code') {
          textToSpeak = `Analysis complete. Detected language is ${response.data.language}. Summary: ${response.data.logicSummary}`;
        } else {
          textToSpeak = `Analysis complete. Summary: ${response.data.conceptSummary || response.data.transcription}`;
        }

        setLoading(false);
        speak(textToSpeak);

        // Accessibility Focus Trap: Move focus to the results block after rendering
        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.focus();
          }
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to complete analysis.');
      speak(`Error: ${err.message || 'Failed to complete analysis.'}`);
      setLoading(false);
    }
  };

  // Toggle voice assistant commands
  const handleToggleVoiceCommands = () => {
    if (isListening) {
      stopListening();
      speak('Voice commands deactivated.');
    } else {
      speak('Listening for commands. Say "analyze" to submit, or "high contrast" to toggle colors.');
      startListening((command) => {
        if (command === 'analyze' || command === 'submit') {
          handleAnalyze();
        } else if (command === 'diagram') {
          setCategory('diagram');
          speak('Category changed to diagram.');
        } else if (command === 'equation') {
          setCategory('equation');
          speak('Category changed to equation.');
        } else if (command === 'graph') {
          setCategory('graph');
          speak('Category changed to graph.');
        } else if (command === 'code') {
          setCategory('code');
          speak('Category changed to code.');
        } else if (command === 'whiteboard') {
          setCategory('whiteboard');
          speak('Category changed to whiteboard.');
        }
      });
    }
  };

  return (
    <div 
      className={`ai-card ${highContrast ? 'high-contrast' : ''}`}
      style={{
        padding: '24px',
        borderRadius: '12px',
        border: highContrast ? '3px solid #ffeb3b' : '1px solid #e0e0e0',
        backgroundColor: highContrast ? '#000000' : '#ffffff',
        color: highContrast ? '#ffffff' : '#333333',
        maxWidth: '600px',
        margin: '20px auto',
        fontFamily: 'sans-serif'
      }}
    >
      <h2 style={{ color: highContrast ? '#ffeb3b' : '#1976d2' }}>STEM Content Analyzer</h2>
      
      {/* Category Selection */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="stem-category" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          Select STEM Category:
        </label>
        <select 
          id="stem-category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '8px',
            width: '100%',
            borderRadius: '6px',
            fontSize: '16px',
            border: highContrast ? '2px solid #ffffff' : '1px solid #ccc',
            backgroundColor: highContrast ? '#222222' : '#ffffff',
            color: highContrast ? '#ffffff' : '#333333'
          }}
        >
          <option value="diagram">Diagram Explainer</option>
          <option value="equation">Formula & Equation Reader</option>
          <option value="graph">Graph Interpreter</option>
          <option value="code">Code Screenshot Explainer</option>
          <option value="whiteboard">Whiteboard Note Reader</option>
        </select>
      </div>

      {/* File Upload Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="image-file" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          Upload Image:
        </label>
        <input 
          id="image-file" 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          style={{
            fontSize: '16px',
            color: highContrast ? '#ffffff' : '#333333'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: highContrast ? '#ffeb3b' : '#1976d2',
            color: '#000000',
            border: 'none'
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>

        <button
          onClick={handleToggleVoiceCommands}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: isListening ? '#f44336' : '#4caf50',
            color: '#ffffff',
            border: 'none'
          }}
        >
          {isListening ? 'Stop Listening' : 'Voice Commands (STT)'}
        </button>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: '#e0e0e0',
              color: '#333333',
              border: 'none'
            }}
          >
            Stop Audio
          </button>
        )}
      </div>

      {/* Status Output - Accessible Live Region */}
      <div 
        aria-live="assertive" 
        style={{
          padding: '10px',
          backgroundColor: highContrast ? '#222222' : '#f5f5f5',
          borderRadius: '4px',
          marginBottom: '16px',
          fontWeight: 'bold'
        }}
      >
        Status: {loading ? 'Analyzing content...' : error ? `Error: ${error}` : 'Ready'}
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div 
          ref={resultRef}
          tabIndex={-1}
          style={{
            marginTop: '20px',
            padding: '16px',
            border: highContrast ? '2px solid #ffeb3b' : '1px solid #1976d2',
            borderRadius: '6px',
            outline: 'none'
          }}
        >
          <h3 style={{ color: highContrast ? '#ffeb3b' : '#1976d2', marginTop: 0 }}>Analysis Result</h3>
          
          {category === 'equation' && (
            <div>
              <p><strong>LaTeX:</strong> <code>{analysisResult.latex}</code></p>
              <p><strong>Spoken Representation:</strong> {analysisResult.spokenRepresentation}</p>
              <p><strong>Explanation:</strong> {analysisResult.explanation}</p>
            </div>
          )}

          {category === 'diagram' && (
            <div>
              <p><strong>Summary:</strong> {analysisResult.summary}</p>
              <p><strong>Nodes:</strong></p>
              <ul>
                {analysisResult.nodes?.map((n, idx) => (
                  <li key={idx}><strong>{n.id} ({n.type}):</strong> {n.description}</li>
                ))}
              </ul>
              <p><strong>Reading Order:</strong> {analysisResult.readingOrder}</p>
            </div>
          )}

          {category === 'graph' && (
            <div>
              <p><strong>Graph Title:</strong> {analysisResult.title}</p>
              <p><strong>X Axis:</strong> {analysisResult.axes?.xAxis}</p>
              <p><strong>Y Axis:</strong> {analysisResult.axes?.yAxis}</p>
              <p><strong>Trend:</strong> {analysisResult.trendAnalysis}</p>
            </div>
          )}

          {category === 'code' && (
            <div>
              <p><strong>Language:</strong> {analysisResult.language}</p>
              <pre style={{ 
                padding: '10px', 
                backgroundColor: '#272822', 
                color: '#f8f8f2', 
                borderRadius: '4px',
                overflowX: 'auto'
              }}>
                <code>{analysisResult.codeBlock}</code>
              </pre>
              <p><strong>Complexity & Summary:</strong> {analysisResult.logicSummary}</p>
            </div>
          )}

          {category === 'whiteboard' && (
            <div>
              <p><strong>Transcription:</strong> {analysisResult.transcription}</p>
              <p><strong>Pedagogical Summary:</strong> {analysisResult.conceptSummary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default AIExplanationCard;
