import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import ChatBox from '../../components/ai/ChatBox'
import { aiService } from '../../services/ai.service'
import './AI.css'

// Helper to convert base64 Data URL back to a File object
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[arr.length - 1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

const AITutor = () => {
  const location = useLocation()

  const [initialMessage, setInitialMessage] = useState('')
  const [initialImageFile, setInitialImageFile] = useState(null)
  const [lessonId, setLessonId] = useState(null)
  const [autoListen, setAutoListen] = useState(false)

  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (location.state && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true

      if (location.state.initialMessage) {
        setInitialMessage(location.state.initialMessage)
      }

      if (location.state.lessonId) {
        setLessonId(location.state.lessonId)
      }

      if (location.state.autoListen) {
        setAutoListen(true)
      }

      if (location.state.initialImage) {
        try {
          const file = dataURLtoFile(
            location.state.initialImage,
            location.state.initialImageName || 'diagram.png'
          )

          setInitialImageFile(file)
        } catch (e) {
          console.error('Error parsing initial image file:', e)
        }
      }

      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleSendMessage = async (message, imageFile = null) => {
    if (imageFile) {
      const response = await aiService.explainDiagram(
        imageFile,
        message || ''
      )

      return (
        response.description ||
        response.summary ||
        'No explanation could be generated.'
      )
    }

    const response = await aiService.chat(message, lessonId)

    return (
      response.answer ||
      response.response ||
      response.message ||
      'No response received.'
    )
  }

  return (
    <div className="ai-page">
      <div className="ai-container">
        <div className="ai-header">
          <h1>AI Tutor</h1>
          <p>Ask any questions about your lessons</p>
        </div>

        <ChatBox
          onSendMessage={handleSendMessage}
          initialMessage={initialMessage}
          initialImage={initialImageFile}
          autoListen={autoListen}
          lessonLoaded={!!lessonId}
        />
      </div>
    </div>
  )
}

export default AITutor