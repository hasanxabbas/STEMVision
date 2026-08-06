import { useState, useRef, useContext, useEffect } from 'react'
import { AccessibilityContext } from '../../context/AccessibilityContextValue'
import './ChatBox.css'
import MessageBubble from './MessageBubble'
import SpeechButton from '../accessibility/SpeechButton'

const ChatBox = ({
  onSendMessage,
  isLoading = false,
  initialMessage = '',
  initialImage = null,
  autoListen = false,
  lessonLoaded = false,
}) => {
  const { speak } = useContext(AccessibilityContext)

  const [messages, setMessages] = useState([])
  useEffect(() => {
  if (!lessonLoaded) return

  setMessages([
    {
      sender: "ai",
      text:
        "👋 Hello! I'm your STEMVision AI Tutor.\n\nI'm ready to help you understand this lesson.\n\n🎤 Ask using your voice\n⌨️ Type any question\n📖 Ask for summaries, formulas, explanations or viva questions.",
      timestamp: new Date(),
    },
  ])
}, [lessonLoaded])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const speechButtonRef = useRef(null)
  const initialProcessed = useRef(false)

  const disabled = isLoading || isSending

  // Handle auto-triggering initial message/image from home page
  useEffect(() => {
    if ((initialMessage || initialImage) && !initialProcessed.current) {
      initialProcessed.current = true

      if (initialImage) {
        setSelectedImage(initialImage)
        setImagePreview(URL.createObjectURL(initialImage))
      }

      if (initialMessage) {
        setInput(initialMessage)
      }

      setTimeout(() => {
        const text = initialMessage || 'Please explain this diagram.'
        sendMessage(text, initialImage)
        setInput('')
      }, 300)
    }
  }, [initialMessage, initialImage])

  // Automatically start microphone when opening from lesson
  useEffect(() => {
    if (!autoListen) return

    const timer = setTimeout(() => {
      speechButtonRef.current?.startListening()
    }, 700)

    return () => clearTimeout(timer)
  }, [autoListen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const sendMessage = async (text, imageFile = null) => {
    if (!text.trim() && !imageFile) return

    const userMessage = {
      text: text.trim(),
      image: imageFile
        ? imagePreview || URL.createObjectURL(imageFile)
        : null,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsSending(true)

    setSelectedImage(null)
    setImagePreview('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    try {
      const reply = await onSendMessage?.(text, imageFile)

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
    } catch (err) {
      console.error(err)

      const errorMessage =
        'Sorry, I could not get an AI response.'

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
    if (!input.trim() && !selectedImage) return

    const text = input.trim()
    const img = selectedImage

    setInput('')

    await sendMessage(text, img)
  }

  const handleSpeechResult = async (transcript) => {
    if (!transcript.trim()) return

    setInput(transcript)

    setTimeout(async () => {
      setInput('')
      await sendMessage(transcript.trim(), null)
    }, 500)
  }

  return (
    <div className="chatbox">
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-card">
              <h2>Start a conversation with your AI Tutor.</h2>

              <p>
                Ask questions, solve problems, or upload a diagram
                to get started.
              </p>

              <div className="welcome-features">
                <div className="feature">
                  📷 Upload diagrams to explain them
                </div>

                <div className="feature">
                  🎤 Speak using voice input
                </div>

                <div className="feature">
                  🧠 Learn complex concepts simply
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            message={msg}
            sender={msg.sender}
          />
        ))}

        {isSending && (
          <div className="message-bubble ai">
            <div className="message-content">
              <span className="typing-indicator">
                STEMVision is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        {imagePreview && (
          <div className="image-attachment-preview">
            <img
              src={imagePreview}
              alt="Upload preview"
            />

            <button
              type="button"
              onClick={handleRemoveImage}
              className="remove-image-btn"
              title="Remove image"
            >
              ×
            </button>
          </div>
        )}

        <div className="input-wrapper">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageSelect}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="attach-btn"
            title="Attach image/diagram"
            disabled={disabled}
          >
            📷
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !disabled) {
                handleSend()
              }
            }}
            placeholder={
  selectedImage
    ? "Add context about this image..."
    : lessonLoaded
    ? "Ask anything about this lesson..."
    : "Type your question..."
}
            disabled={disabled}
          />

          <SpeechButton
            ref={speechButtonRef}
            onSpeechResult={handleSpeechResult}
          />

          <button
            onClick={handleSend}
            disabled={
              disabled ||
              (!input.trim() && !selectedImage)
            }
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