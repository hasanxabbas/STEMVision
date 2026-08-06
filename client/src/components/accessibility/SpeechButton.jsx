import {
  useState,
  useContext,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { AccessibilityContext } from '../../context/AccessibilityContextValue'
import './SpeechButton.css'

const SpeechButton = forwardRef(({ onSpeechResult }, ref) => {
  const { speak } = useContext(AccessibilityContext)

  const [isListening, setIsListening] = useState(false)

  const recognitionRef = useRef(null)

  const startListening = () => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      speak('Speech recognition is not supported in your browser')
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()

    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim()

      onSpeechResult?.(transcript)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
  }

  useImperativeHandle(ref, () => ({
    startListening,
    stopListening,
  }))

  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`speech-btn ${isListening ? 'listening' : ''}`}
      title="Voice Input"
      type="button"
    >
      {isListening ? '🔴' : '🎤'}
    </button>
  )
})

export default SpeechButton