import api from './api'

export const learningHistoryService = {
  getHistory: async () => {
    const response = await api.get('/learning-history')
    return response.data
  },

  logActivity: async (activityData) => {
    const response = await api.post('/learning-history/log', activityData)
    return response.data
  },

  getChatSessions: async () => {
    const response = await api.get('/ai/chats')
    return response.data
  },

  getChatSessionById: async (id) => {
    const response = await api.get(`/ai/chats/${id}`)
    return response.data
  },
}
