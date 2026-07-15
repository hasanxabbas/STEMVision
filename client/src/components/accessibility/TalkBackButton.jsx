import { useState } from 'react'

const TalkBackButton = ({ text }) => {
  const [speaking, setSpeaking] = useState(false)

  const handleSpeak = () => {
    if (!text) return

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setSpeaking(true)

    utterance.onend = () => setSpeaking(false)

    utterance.onerror = () => setSpeaking(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  return (
    <button
      className="talkback-btn"
      onClick={handleSpeak}
      aria-label="Read AI response aloud"
    >
      {speaking ? '⏹ Stop' : '🔊 Listen'}
    </button>
  )
}

export default TalkBackButton