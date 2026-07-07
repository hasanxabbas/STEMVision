import api from './api'
import { ENDPOINTS } from '../config/constant'

const normalizeUser = (user) => {
  if (!user) return null

  return {
    ...user,
    fullName: user.fullName || user.name || user.username || 'User',
    role: user.role ? user.role.toLowerCase() : 'student',
  }
}

const normalizeAuthResponse = (data) => ({
  ...data,
  user: normalizeUser(data.user),
})

export const authService = {
  login: async (email, password) => {
    const response = await api.post(ENDPOINTS.AUTH_LOGIN, { email, password })
    return normalizeAuthResponse(response.data)
  },

  register: async (fullName, email, password, role) => {
    const response = await api.post(ENDPOINTS.AUTH_REGISTER, {
      username: fullName,
      name: fullName,
      email,
      password,
      role: role === 'teacher' ? 'Teacher' : 'Student',
    })
    return normalizeAuthResponse(response.data)
  },

  logout: async () => {
    const response = await api.post(ENDPOINTS.AUTH_LOGOUT)
    return response.data
  },

  getProfile: async () => {
    const response = await api.get(ENDPOINTS.STUDENT_PROFILE)
    return normalizeAuthResponse(response.data)
  },
}
