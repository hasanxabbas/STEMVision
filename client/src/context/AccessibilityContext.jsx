import { useState, useEffect } from 'react'
import { AccessibilityContext } from './AccessibilityContextValue'

export const AccessibilityProvider = ({ children }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [fontSize, setFontSize] = useState('medium')
  const [colorVisionMode, setColorVisionMode] = useState('default')
  const [speechRate, setSpeechRate] = useState(1)
  const [language, setLanguage] = useState('English')

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
    if (!text) return
    if (!('speechSynthesis' in window)) return
    if (!voiceEnabled) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.rate = speechRate
    utterance.pitch = 1
    utterance.volume = 1
    utterance.lang = 'en-US'

    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 100)
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopSpeaking()
    }

    setVoiceEnabled((prev) => !prev)
  }

  const toggleHighContrast = () => setHighContrast((prev) => !prev)

  const toggleScreenReader = () =>
    setScreenReaderEnabled((prev) => !prev)

  return (
    <AccessibilityContext.Provider
      value={{
        voiceEnabled,
        toggleVoice,

        fontSize,
        setFontSize,

        colorVisionMode,
        setColorVisionMode,

        speechRate,
        setSpeechRate,

        language,
        setLanguage,

        highContrast,
        toggleHighContrast,

        screenReaderEnabled,
        toggleScreenReader,

        speak,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}