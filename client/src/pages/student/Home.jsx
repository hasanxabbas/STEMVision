import { useState, useEffect, useContext, useCallback } from 'react'
import { subjectService } from '../../services/subject.service'
import { lessonService } from '../../services/lesson.service'
import { AuthContext } from '../../context/AuthContextValue'
import SubjectCard from '../../components/student/SubjectCard'
import Loader from '../../components/common/Loader'
import { toList, getItemId } from '../../utils/apiData'
import './Student.css'

const Home = () => {
  const [subjects, setSubjects] = useState([])
  const [latestLesson, setLatestLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  const { user } = useContext(AuthContext)

  const loadDashboard = useCallback(async () => {
    try {
      const subjectsData = await subjectService.getAll()
      setSubjects(toList(subjectsData, ['subjects']))

      const lessonResponse = await lessonService.getLatest()

      if (lessonResponse.success && lessonResponse.data) {
        const lesson = lessonResponse.data

        const lastAnnounced = localStorage.getItem('lastAnnouncedLesson')

        if (lastAnnounced !== lesson._id) {
          setLatestLesson(lesson)

          const speech = new SpeechSynthesisUtterance(
            `Hello ${user?.fullName || 'Student'}. A new lesson has been uploaded called ${lesson.title}. Would you like to study it now?`
          )

          speech.rate = 1
          speech.pitch = 1
          speech.volume = 1

          window.speechSynthesis.cancel()
          window.speechSynthesis.speak(speech)

          localStorage.setItem('lastAnnouncedLesson', lesson._id)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (loading) return <Loader />

  return (
    <div className="student-page">
      <div className="page-header">
        <h1>Welcome, {user?.fullName}!</h1>
        <p>Choose a subject to get started</p>
      </div>

      {latestLesson && (
        <div className="lesson-announcement">
          <h2>📚 New Lesson Available</h2>

          <h3>{latestLesson.title}</h3>

          <p>{latestLesson.description}</p>

          <div className="lesson-actions">
            <button className="btn btn-primary">
              📖 Study Now
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setLatestLesson(null)}
            >
              Later
            </button>
          </div>
        </div>
      )}

      <div className="subjects-grid">
        {subjects.length === 0 && (
          <p className="empty-state">
            No subjects are available yet.
          </p>
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