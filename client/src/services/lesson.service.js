import api from './api'
import { ENDPOINTS } from '../config/constant'

export const lessonService = {
  getAll: async (subjectId) => {
    const response = await api.get(ENDPOINTS.LESSONS, {
      params: { subjectId },
    })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`${ENDPOINTS.LESSONS}/${id}`)
    return response.data
  },

  create: async (lessonData) => {
    const response = await api.post(ENDPOINTS.LESSONS, lessonData)
    return response.data
  },

  update: async (id, lessonData) => {
    const response = await api.put(`${ENDPOINTS.LESSONS}/${id}`, lessonData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`${ENDPOINTS.LESSONS}/${id}`)
    return response.data
  },

  upload: async (formData) => {
    const response = await api.post(ENDPOINTS.UPLOAD_LESSON, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}
