import { useState, useEffect } from 'react'
import { AccessibilityContext } from './AccessibilityContextValue'

export const AccessibilityProvider = ({ children }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [fontSize, setFontSize] = useState("medium")

const [colorVisionMode, setColorVisionMode] = useState("default")

const [speechRate, setSpeechRate] = useState(1)

const [language, setLanguage] = useState("English")
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem('highContrast') === 'true' || false
  )
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false)

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-contrast', 'high')
    } else {
      document.documentElement.removeAttribute('data-contrast')
    }
    localStorage.setItem('highContrast', highContrast)
  }, [highContrast])

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = speechRate;
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const toggleVoice = () => setVoiceEnabled(!voiceEnabled)
  const toggleHighContrast = () => setHighContrast(!highContrast)
  const toggleScreenReader = () => setScreenReaderEnabled(!screenReaderEnabled)

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
setFontSize,

colorVisionMode,
setColorVisionMode,

speechRate,
setSpeechRate,

language,
setLanguage,
        voiceEnabled,
        highContrast,
        screenReaderEnabled,
        speak,
        stopSpeaking,
        toggleVoice,
        toggleHighContrast,
        toggleScreenReader,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}
