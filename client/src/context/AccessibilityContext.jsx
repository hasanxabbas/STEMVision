import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AccessibilityContext = createContext(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  // Text-to-Speech (TTS) State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0); // Speed: 0.5 to 2.0
  const [speechPitch, setSpeechPitch] = useState(1.0); // Pitch: 0.5 to 2.0
  const [speechVolume, setSpeechVolume] = useState(1.0); // Volume: 0.0 to 1.0

  // Display/Visual Accessibility
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderAssistance, setScreenReaderAssistance] = useState(true);

  // Speech-to-Text (STT) Voice Commands State
  const [isListening, setIsListening] = useState(false);
  const [commandLog, setCommandLog] = useState([]);
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // Initialize Speech Recognition on client load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        console.log('Voice Command Listener active.');
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      console.warn('Web Speech Recognition API is not supported in this browser.');
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Speak method
  const speak = (text) => {
    if (!synthRef.current) return;

    // Cancel any active utterance
    synthRef.current.cancel();

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = speechVolume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    synthRef.current.speak(utterance);
  };

  // TTS Control Functions
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const pauseSpeaking = () => {
    if (synthRef.current && isSpeaking && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeaking = () => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  // Start voice command recognition
  const startListening = (onCommandCallback) => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not available.');
      return;
    }

    recognitionRef.current.onresult = (event) => {
      const lastResultIndex = event.results.length - 1;
      const command = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
      
      setCommandLog((prev) => [command, ...prev].slice(0, 10));

      // Global Command Interception
      if (command.includes('stop speech') || command === 'stop') {
        stopSpeaking();
        speak('Audio stopped.');
      } else if (command === 'toggle contrast' || command === 'high contrast') {
        setHighContrast((prev) => !prev);
        speak('High contrast mode toggled.');
      } else if (onCommandCallback) {
        onCommandCallback(command);
      }
    };

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Speech recognition already active or failed to start:', err.message);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const value = {
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isSpeaking,
    isPaused,
    speechRate,
    setSpeechRate,
    speechPitch,
    setSpeechPitch,
    speechVolume,
    setSpeechVolume,
    
    highContrast,
    setHighContrast,
    screenReaderAssistance,
    setScreenReaderAssistance,

    isListening,
    startListening,
    stopListening,
    commandLog,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      <div className={highContrast ? 'high-contrast-mode' : ''} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};
export default AccessibilityContext;
