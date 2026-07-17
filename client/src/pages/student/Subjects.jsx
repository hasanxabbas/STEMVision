import { useCallback, useEffect, useState } from 'react'
import { subjectService } from '../../services/subject.service'
import { lessonService } from '../../services/lesson.service'
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
    const subjectData = await subjectService.getAll()
    const lessonData = await lessonService.getAll()

    const subjects = toList(subjectData, ["subjects"])
    const lessons = toList(lessonData, ["lessons"])

    const updatedSubjects = subjects.map((subject) => ({
      ...subject,
      lessonCount: lessons.filter((lesson) => {
        if (!lesson.subject) return false

        const lessonSubjectId =
          typeof lesson.subject === "object"
            ? lesson.subject._id
            : lesson.subject

        return lessonSubjectId === subject._id
      }).length,
    }))

    setSubjects(updatedSubjects)
    setMessage(getApiMessage(subjectData, ""))
  } catch {
    setMessage("Unable to load subjects right now.")
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
