export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/signup',
  AUTH_LOGOUT: '/auth/logout',

  // Students
  STUDENT_PROFILE: '/auth/profile',
  STUDENT_HISTORY: '/students/history',

  // Teachers
  TEACHER_DASHBOARD: '/teachers/dashboard',

  // Subjects
  SUBJECTS: '/subjects',
  SUBJECT_BY_ID: '/subjects/:id',

  // Lessons
  LESSONS: '/lessons',
  LESSON_BY_ID: '/lessons/:id',
  UPLOAD_LESSON: '/lessons/upload',

  // AI
  AI_CHAT: '/ai/tutor',
  AI_EXPLAIN_DIAGRAM: '/ai/vision',
  AI_QUIZ_GENERATE: '/ai/quiz',

  // Quiz
  QUIZ: '/quizzes',
  QUIZ_SUBMIT: '/quizzes/submit',

  // Notifications
  NOTIFICATIONS: '/notifications',
}

export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STUDENT_HOME: '/student/home',
  STUDENT_SUBJECTS: '/student/subjects',
  STUDENT_HISTORY: '/student/history',
  STUDENT_PROFILE: '/student/profile',
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_MANAGE_SUBJECTS: '/teacher/manage-subjects',
  TEACHER_MANAGE_LESSONS: '/teacher/manage-lessons',
  TEACHER_UPLOAD_NOTES: '/teacher/upload-notes',
  AI_TUTOR: '/ai/tutor',
  AI_QUIZ: '/ai/quiz',
}
