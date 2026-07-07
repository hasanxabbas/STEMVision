import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import { lessonService } from '../../services/lesson.service'
import { subjectService } from '../../services/subject.service'
import { ROUTES } from '../../config/constant'
import { toList } from '../../utils/apiData'
import './Teacher.css'

const Dashboard = () => {
  const [stats, setStats] = useState({ subjects: 0, lessons: 0 })
  const [loading, setLoading] = useState(true)

  const loadDashboard = useCallback(async () => {
    try {
      const [subjectsData, lessonsData] = await Promise.all([
        subjectService.getAll(),
        lessonService.getAll(),
      ])

      setStats({
        subjects: toList(subjectsData, ['subjects']).length,
        lessons: toList(lessonsData, ['lessons']).length,
      })
    } catch {
      setStats({ subjects: 0, lessons: 0 })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadDashboard, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadDashboard])

  if (loading) return <Loader />

  return (
    <div className="teacher-page">
      <div className="page-header">
        <h1>Teacher Dashboard</h1>
        <p>Manage STEMVision subjects, lessons, and uploaded materials</p>
      </div>

      <div className="teacher-stats">
        <div className="teacher-stat">
          <span>{stats.subjects}</span>
          <p>Subjects</p>
        </div>
        <div className="teacher-stat">
          <span>{stats.lessons}</span>
          <p>Lessons</p>
        </div>
      </div>

      <div className="teacher-actions">
        <Link to={ROUTES.TEACHER_MANAGE_SUBJECTS} className="btn btn-primary">
          Manage Subjects
        </Link>
        <Link to={ROUTES.TEACHER_MANAGE_LESSONS} className="btn btn-secondary">
          Manage Lessons
        </Link>
        <Link to={ROUTES.TEACHER_UPLOAD_NOTES} className="btn btn-success">
          Upload Notes
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
