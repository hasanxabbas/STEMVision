import { useState, useEffect, useContext, useCallback } from 'react'
import { subjectService } from '../../services/subject.service'
import { AuthContext } from '../../context/AuthContextValue'
import SubjectCard from '../../components/student/SubjectCard'
import Loader from '../../components/common/Loader'
import { toList, getItemId } from '../../utils/apiData'
import './Student.css'

const Home = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  const loadSubjects = useCallback(async () => {
    try {
      const data = await subjectService.getAll()
      setSubjects(toList(data, ['subjects']))
    } catch (error) {
      console.error('Failed to load subjects:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadSubjects, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadSubjects])

  if (loading) return <Loader />

  return (
    <div className="student-page">
      <div className="page-header">
        <h1>Welcome, {user?.fullName}!</h1>
        <p>Choose a subject to get started</p>
      </div>

      <div className="subjects-grid">
        {subjects.length === 0 && (
          <p className="empty-state">No subjects are available yet.</p>
        )}

        {subjects.map((subject) => (
          <SubjectCard
            key={getItemId(subject)}
            subject={subject}
            lessonCount={subject.lessonCount || 0}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
