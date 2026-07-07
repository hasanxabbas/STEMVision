import ChatBox from '../../components/ai/ChatBox'
import { aiService } from '../../services/ai.service'
import './AI.css'

const AITutor = () => {
  const handleSendMessage = async (message) => {
    const response = await aiService.chat(message)
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
        <ChatBox onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default AITutor
