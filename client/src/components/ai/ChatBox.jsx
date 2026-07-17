import { useState, useRef, useEffect, useContext } from 'react'
import { AccessibilityContext } from '../../context/AccessibilityContextValue'
import './ChatBox.css'
import MessageBubble from './MessageBubble'
import SpeechButton from '../accessibility/SpeechButton'

const ChatBox = ({ onSendMessage, isLoading = false }) => {
  const { speak } = useContext(AccessibilityContext)
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


  const sendMessage = async (text) => {
  if (!text.trim() || isSending) return

  const userMessage = {
    text,
    sender: 'user',
    timestamp: new Date(),
  }

  setMessages((prev) => [...prev, userMessage])

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
 

  const handleSend = async () => {
  if (!input.trim()) return

  const text = input.trim()

  setInput('')

  await sendMessage(text)
}

 const handleSpeechResult = async (transcript) => {
  if (!transcript.trim()) return

  // Show what was recognized
  setInput(transcript)

  // Small delay so the user can see the text
  setTimeout(async () => {
    setInput('')
    await sendMessage(transcript.trim())
  }, 500)
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
           onKeyDown={(e) => {
  if (e.key === 'Enter' && !disabled) {
    handleSend()
  }
}}
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