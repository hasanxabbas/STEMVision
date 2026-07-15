import { useState, useRef, useEffect } from 'react'
import './ChatBox.css'
import MessageBubble from './MessageBubble'
import SpeechButton from '../accessibility/SpeechButton'

const ChatBox = ({ onSendMessage, isLoading = false }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef(null)

  const disabled = isLoading || isSending

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const speak = (text) => {
    if (!text) return

    // Stop any speech already playing
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    window.speechSynthesis.speak(utterance)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const text = input.trim()

    const userMessage = {
      text,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      setIsSending(true)

      const reply = await onSendMessage?.(text)

      const aiReply = reply || 'No response received.'

      setMessages((prev) => [
        ...prev,
        {
          text: aiReply,
          sender: 'ai',
          timestamp: new Date(),
        },
      ])

      // 🔊 Automatically read AI response
      speak(aiReply)
    } catch {
      const errorMessage = 'Sorry, I could not get an AI response.'

      setMessages((prev) => [
        ...prev,
        {
          text: errorMessage,
          sender: 'ai',
          timestamp: new Date(),
        },
      ])

      speak(errorMessage)
    } finally {
      setIsSending(false)
    }
  }

  const handleSpeechResult = (transcript) => {
    setInput(transcript)
  }

  return (
    <div className="chatbox">
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Ask your first question.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            message={msg}
            sender={msg.sender}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            disabled={disabled}
          />

          <SpeechButton onSpeechResult={handleSpeechResult} />

          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="send-btn"
            aria-label="Send message"
          >
            {disabled ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox