import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContextValue'
import { ROUTES, USER_ROLES } from '../config/constant'

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

import StudentHome from '../pages/student/Home'
import StudentSubjects from '../pages/student/Subjects'
import StudentHistory from '../pages/student/History'
import StudentProfile from '../pages/student/Profile'

import TeacherDashboard from '../pages/teacher/Dashboard'
import ManageSubjects from '../pages/teacher/ManageSubjects'
import ManageLessons from '../pages/teacher/ManageLessons'
import UploadNotes from '../pages/teacher/UploadNotes'

import AITutor from '../pages/ai/AITutor'
import Quiz from '../pages/ai/Quiz'

import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
  const { token } = useContext(AuthContext)

  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      {/* Student Routes */}
      <Route
        path={ROUTES.STUDENT_HOME}
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
            <StudentHome />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STUDENT_SUBJECTS}
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
            <StudentSubjects />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STUDENT_HISTORY}
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
            <StudentHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STUDENT_PROFILE}
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path={ROUTES.TEACHER_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.TEACHER_MANAGE_SUBJECTS}
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}>
            <ManageSubjects />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.TEACHER_MANAGE_LESSONS}
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}>
            <ManageLessons />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.TEACHER_UPLOAD_NOTES}
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}>
            <UploadNotes />
          </ProtectedRoute>
        }
      />

      {/* AI Routes */}
      <Route
        path={ROUTES.AI_TUTOR}
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
            <AITutor />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.AI_QUIZ}
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
            <Quiz />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          token ? (
            <Navigate to={ROUTES.STUDENT_HOME} replace />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
