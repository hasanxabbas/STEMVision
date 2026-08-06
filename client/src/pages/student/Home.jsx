import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { lessonService } from '../../services/lesson.service'
import { AuthContext } from '../../context/AuthContextValue'
import Loader from '../../components/common/Loader'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [latestLesson, setLatestLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isListening, setIsListening] = useState(false)

  const recognitionRef = useRef(null)
  const fileInputRef = useRef(null)
  const progressSectionRef = useRef(null)

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    'Student'

  const hour = new Date().getHours()
  let greeting = 'Good Evening'

  if (hour < 12) {
    greeting = 'Good Morning'
  } else if (hour < 17) {
    greeting = 'Good Afternoon'
  }

  const loadDashboardData = useCallback(async () => {
    try {
      const lessonResponse = await lessonService.getLatest()

      if (lessonResponse.success && lessonResponse.data) {
        setLatestLesson(lessonResponse.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

 useEffect(() => {
  if (!latestLesson) return

  const lastAnnouncedLesson = localStorage.getItem(
    "lastAnnouncedLesson"
  )

  if (lastAnnouncedLesson === latestLesson._id) {
    return
  }

  window.speechSynthesis.cancel()

  const speech = new SpeechSynthesisUtterance(
    `A new lesson titled ${latestLesson.title} has been uploaded. Press Learn with AI to begin studying.`
  )

  speech.rate = 1
  speech.pitch = 1
window.speechSynthesis.cancel()
  window.speechSynthesis.speak(speech)

  localStorage.setItem(
    "lastAnnouncedLesson",
    latestLesson._id
  )
}, [latestLesson])

  const startListening = () => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      alert('Speech recognition is not supported.')
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()

    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)

    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript.trim()

      if (transcript) {
        navigate('/ai/tutor', {
          state: {
            initialMessage: transcript,
          },
        })
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
  }

  const handleVoiceClick = () => {
    isListening ? stopListening() : startListening()
  }

  const handleDiagramCardClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      navigate('/ai/tutor', {
        state: {
          initialImage: reader.result,
          initialImageName: file.name,
          initialImageType: file.type,
        },
      })
    }

    reader.readAsDataURL(file)
  }

  const handleScrollToProgress = () => {
    progressSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  if (loading) return <Loader />

  const latestLessonSubject = latestLesson?.subject

  const subjectName =
    typeof latestLessonSubject === 'object'
      ? latestLessonSubject.name
      : 'STEM Learning'

  const subjectId =
    typeof latestLessonSubject === 'object'
      ? latestLessonSubject._id
      : latestLessonSubject

  return (
    <div className="student-home-container">
      <div className="container">

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Hero */}
        <section className="hero">
          <h2>{greeting},</h2>

          <h1>{displayName} 👋</h1>

          <p>
            I'm STEMVision, your AI study companion.
            <br />
            What would you like to learn today?
          </p>
        </section>

        {/* Voice */}
        <section className="voice">
          <div
            className={`orb ${
              isListening ? 'listening' : ''
            }`}
            onClick={handleVoiceClick}
            style={{ cursor: 'pointer' }}
          >
            🎤
          </div>

          <button
            className={`voice-btn ${
              isListening ? 'listening' : ''
            }`}
            onClick={handleVoiceClick}
          >
            {isListening
              ? 'Listening...'
              : 'Tap to Speak'}
          </button>
        </section>

        {/* Action Cards */}
        <section
          className="cards"
          aria-label="Quick Actions"
        >

          {/* Explain Diagram */}
          <div
            className="card card-blue"
            onClick={handleDiagramCardClick}
          >
            <div className="card-icon-badge blue-badge">
              📷
            </div>

            <div className="card-content">
              <h3>Explain Diagram</h3>

              <p>
                Upload diagrams, graphs and charts.
              </p>
            </div>
          </div>

          {/* Read PDF */}
          <div
            className="card card-green"
            onClick={() =>
              navigate('/student/subjects')
            }
          >
            <div className="card-icon-badge green-badge">
              📄
            </div>

            <div className="card-content">
              <h3>Read PDF</h3>

              <p>
                Read books, notes and study
                material.
              </p>
            </div>
          </div>

          {/* AI Tutor */}
          <div
            className="card card-amber"
            onClick={() => navigate('/ai/tutor')}
          >
            <div className="card-icon-badge amber-badge">
              🧠
            </div>

            <div className="card-content">
              <h3>Learn Concept</h3>

              <p>
                Simple AI explanations.
              </p>
            </div>
          </div>

          {/* Quiz */}
          <div
            className="card card-purple"
            onClick={() => navigate('/ai/quiz')}
          >
            <div className="card-icon-badge purple-badge">
              📝
            </div>

            <div className="card-content">
              <h3>Quiz Me</h3>

              <p>
                Test your understanding.
              </p>
            </div>
          </div>

          {/* Latest Lesson */}
          <div
            className="card card-cyan"
            onClick={handleScrollToProgress}
          >
            <div className="card-icon-badge cyan-badge">
              📚
            </div>

            <div className="card-content">
              <h3>Latest Lesson</h3>

              <p>
                Continue from the latest uploaded notes.
              </p>
            </div>
          </div>

        </section>

        {/* Latest Lesson */}
        <section
          className="progress"
          ref={progressSectionRef}
        >
          <h2>🔔 New Lesson Available</h2>

          {latestLesson ? (
            <>
              <span className="latest-label">
  📢 Your teacher has uploaded new study material.
</span>

              <h3>{latestLesson.title}</h3>

<p
  style={{
    color: "#777",
    marginTop: "8px",
    fontWeight: 500,
  }}
>
  📚 {subjectName}
</p>

              <p
                style={{
                  fontSize: '1.15rem',
                  marginTop: '10px',
                  color: 'var(--text-light)',
                }}
              >
                {latestLesson.title}
              </p>

              {latestLesson.description && (
                <p
                  style={{
                    marginTop: '18px',
                    lineHeight: '1.8',
                    color:
                      'var(--text-light)',
                  }}
                >
                  {latestLesson.description}
                </p>
              )}

              <div
  style={{
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginTop: "25px",
  }}
>
  <button
    onClick={() =>
      navigate(`/student/subjects/${subjectId}`)
    }
  >
    📄 Read Lesson
  </button>

  <button
    onClick={() =>
      navigate("/ai/tutor", {
  state: {
    lessonId: latestLesson._id,
    autoListen: true,
  },
})
    }
  >
    🤖 Learn with AI
  </button>
</div>
            </>
          ) : (
            <>
              <h3>
                No Learning Material Available
              </h3>

              <p>
                Your teachers haven't uploaded
                any study material yet.
              </p>

              <button
                onClick={() =>
                  navigate('/student/subjects')
                }
              >
                📚 Browse Subjects
              </button>
            </>
          )}
        </section>

      </div>
    </div>
  )
}

export default Home