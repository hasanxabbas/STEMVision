import api from './api'
import { ENDPOINTS } from '../config/constant'

export const quizService = {
  getById: async (id) => {
    const response = await api.get(`${ENDPOINTS.QUIZ}/${id}`)
    return response.data
  },

  submit: async (quizId, answers) => {
    const response = await api.post(ENDPOINTS.QUIZ_SUBMIT, {
      quizId,
      answers,
    })
    return response.data
  },

  getHistory: async () => {
  const response = await api.get(ENDPOINTS.QUIZ)
  return response.data
},
}
