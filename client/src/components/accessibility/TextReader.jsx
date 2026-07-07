import { useEffect } from 'react'

const TextReader = ({ text, autoRead = false }) => {
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  useEffect(() => {
    if (autoRead && text && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }
  }, [autoRead, text])

  return (
    <div className="text-reader">
      <button onClick={handleSpeak} className="speak-btn" aria-label="Read text">
        🔊 Listen
      </button>
      <button onClick={handleStop} className="stop-btn" aria-label="Stop reading">
        ⏹ Stop
      </button>
    </div>
  )
}

export default TextReader
