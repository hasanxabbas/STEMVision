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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      setMessages((prev) => [
        ...prev,
        {
          text: reply || 'No response received.',
          sender: 'ai',
          timestamp: new Date(),
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, I could not get an AI response.',
          sender: 'ai',
          timestamp: new Date(),
        },
      ])
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
            <p>Start asking questions about your lessons!</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} sender={msg.sender} />
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
