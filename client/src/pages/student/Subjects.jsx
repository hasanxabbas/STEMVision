import { useCallback, useEffect, useState } from 'react'
import { subjectService } from '../../services/subject.service'
import SubjectCard from '../../components/student/SubjectCard'
import Loader from '../../components/common/Loader'
import { getApiMessage, getItemId, toList } from '../../utils/apiData'
import './Student.css'

const Subjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadSubjects = useCallback(async () => {
    try {
      const data = await subjectService.getAll()
      setSubjects(toList(data, ['subjects']))
      setMessage(getApiMessage(data, ''))
    } catch {
      setMessage('Unable to load subjects right now.')
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
        <h1>Subjects</h1>
        <p>Browse available STEM learning areas</p>
      </div>

      {message && <p className="status-message">{message}</p>}

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

export default Subjects
