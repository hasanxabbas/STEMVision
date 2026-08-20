import api from './api'
import { ENDPOINTS } from '../config/constant'

export const aiService = {
  chat: async (message, lessonId = null, chatHistoryId = null) => {
    const response = await api.post(ENDPOINTS.AI_CHAT, {
      message,
      lessonId,
      chatHistoryId,
    })

    return response.data
  },

  explainDiagram: async (imageFile, context = null, chatHistoryId = null) => {
    const formData = new FormData()
    formData.append('image', imageFile)

    if (context) {
      formData.append('context', context)
    }
    if (chatHistoryId) {
      formData.append('chatHistoryId', chatHistoryId)
    }

    const response = await api.post(
      ENDPOINTS.AI_EXPLAIN_DIAGRAM,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  },

  generateQuiz: async (lessonId, numberOfQuestions = 5) => {
    const response = await api.post(ENDPOINTS.AI_QUIZ_GENERATE, {
      lessonId,
      numberOfQuestions,
    })

    return response.data
  },
}