import { useState, useContext } from 'react'
import { AccessibilityContext } from '../../context/AccessibilityContextValue'

const SpeechButton = ({ onSpeechResult }) => {
  const { speak } = useContext(AccessibilityContext)
  const [isListening, setIsListening] = useState(false)

  const handleClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      speak('Speech recognition is not supported in your browser')
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('')
      onSpeechResult?.(transcript)
    }

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`speech-btn ${isListening ? 'listening' : ''}`}
      aria-label="Voice input"
      title={isListening ? 'Listening...' : 'Click to speak'}
    >
      {isListening ? '🎤' : '🎙️'}
    </button>
  )
}

export default SpeechButton
