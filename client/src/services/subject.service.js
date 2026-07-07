import api from './api'
import { ENDPOINTS } from '../config/constant'

export const subjectService = {
  getAll: async () => {
    const response = await api.get(ENDPOINTS.SUBJECTS)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`${ENDPOINTS.SUBJECTS}/${id}`)
    return response.data
  },

  create: async (subjectData) => {
    const response = await api.post(ENDPOINTS.SUBJECTS, subjectData)
    return response.data
  },

  update: async (id, subjectData) => {
    const response = await api.put(`${ENDPOINTS.SUBJECTS}/${id}`, subjectData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`${ENDPOINTS.SUBJECTS}/${id}`)
    return response.data
  },
}
