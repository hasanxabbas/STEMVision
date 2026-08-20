import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { subjectService } from '../../services/subject.service'
import { lessonService } from '../../services/lesson.service'
import { aiService } from '../../services/ai.service'
import { toList } from '../../utils/apiData'
import { AccessibilityContext } from '../../context/AccessibilityContextValue'
import Loader from '../../components/common/Loader'
import { learningHistoryService } from '../../services/learningHistory.service'
import './AI.css'

const Quiz = () => {
  const navigate = useNavigate()
  const { speak } = useContext(AccessibilityContext)

  // Subjects and lessons for configuration
  const [subjects, setSubjects] = useState([])
  const [lessons, setLessons] = useState([])
  const [loadingConfig, setLoadingConfig] = useState(true)

  // Configuration state
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [selectedLessonId, setSelectedLessonId] = useState('')
  const [numQuestions, setNumQuestions] = useState(5)

  // Quiz execution state
  const [quizState, setQuizState] = useState('config') // 'config' | 'generating' | 'active' | 'results'
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null) // null | string
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [error, setError] = useState('')

  // Load configuration options
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const subjectData = await subjectService.getAll()
        setSubjects(toList(subjectData, ['subjects']))
      } catch (err) {
        console.error('Error fetching subjects:', err)
        setError('Failed to load subject list. Please refresh the page.')
      } finally {
        setLoadingConfig(false)
      }
    }
    fetchConfig()
  }, [])

  // Load lessons when selected subject changes
  useEffect(() => {
    if (!selectedSubjectId) {
      setLessons([])
      setSelectedLessonId('')
      return
    }

    const fetchLessons = async () => {
      try {
        const lessonData = await lessonService.getAll(selectedSubjectId)
        setLessons(toList(lessonData, ['lessons']))
        setSelectedLessonId('')
      } catch (err) {
        console.error('Error fetching lessons:', err)
      }
    }
    fetchLessons()
  }, [selectedSubjectId])

  // Handle quiz generation
  const handleStartQuiz = async (e) => {
    e.preventDefault()
    if (!selectedLessonId) {
      setError('Please select a lesson to continue.')
      return
    }

    setError('')
    setQuizState('generating')
    speak('Generating your personalized quiz. Please wait.')

    try {
      const data = await aiService.generateQuiz(selectedLessonId, numQuestions)
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions)
        setCurrentIdx(0)
        setScore(0)
        setSelectedOption(null)
        setIsAnswered(false)
        setQuizState('active')
        speak(`Quiz generated. First question: ${data.questions[0].questionText}`)
      } else {
        throw new Error('No questions returned.')
      }
    } catch (err) {
      console.error('Error generating quiz:', err)
      setError('Failed to generate quiz questions. Please try again.')
      setQuizState('config')
    }
  }

  // Handle option selection
  const handleSelectOption = (option) => {
    if (isAnswered) return
    setSelectedOption(option)
    setIsAnswered(true)

    const correctAns = questions[currentIdx].correctAnswer
    const isCorrect = option === correctAns

    if (isCorrect) {
      setScore((prev) => prev + 1)
      speak('Correct!')
    } else {
      speak(`Incorrect. The correct answer is: ${correctAns}`)
    }
  }

  // Speak current question
  const handleSpeakQuestion = () => {
    if (questions.length === 0) return
    speak(questions[currentIdx].questionText)
  }

  // Handle next question
  const handleNext = () => {
    setSelectedOption(null)
    setIsAnswered(false)
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1)
      speak(`Question ${currentIdx + 2}: ${questions[currentIdx + 1].questionText}`)
    } else {
      setQuizState('results')
      speak(`Quiz finished. Your final score is ${score} out of ${questions.length}.`)
      
      // Log quiz activity
      const lessonTitle = lessons.find(l => l._id === selectedLessonId)?.title || 'Lesson Quiz';
      learningHistoryService.logActivity({
        activityType: 'quiz',
        title: `AI Quiz: ${lessonTitle}`,
        subjectId: selectedSubjectId,
        lessonId: selectedLessonId,
        details: {
          score,
          totalQuestions: questions.length
        }
      }).catch(err => console.error('Error logging quiz:', err));
    }
  }

  const handleRetake = () => {
    setQuizState('config')
    setQuestions([])
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
  }

  if (loadingConfig) return <Loader />

  return (
    <div className="ai-page quiz-page">
      <div className="quiz-container">
        
        {/* Step 1: Configuration Form */}
        {quizState === 'config' && (
          <div className="quiz-config-card">
            <h1>🎯 AI Quiz Generator</h1>
            <p className="subtitle">Test your understanding with instant feedback</p>
            
            {error && <div className="quiz-error">{error}</div>}

            <form onSubmit={handleStartQuiz} className="quiz-config-form">
              <div className="form-group">
                <label htmlFor="subject">Select Subject</label>
                <select
                  id="subject"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="lesson">Select Lesson</label>
                <select
                  id="lesson"
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  required
                  disabled={!selectedSubjectId}
                >
                  <option value="">-- Choose Lesson --</option>
                  {lessons.map((les) => (
                    <option key={les._id} value={les._id}>
                      {les.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="numQuestions">Number of Questions</label>
                <select
                  id="numQuestions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary quiz-start-btn">
                ✨ Generate AI Quiz
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Generating Quiz Spinner */}
        {quizState === 'generating' && (
          <div className="quiz-generating-card">
            <div className="spinner"></div>
            <h2>Generating Quiz Questions...</h2>
            <p>STEMVision is parsing the lesson materials to create conceptual questions for you.</p>
          </div>
        )}

        {/* Step 3: Active Question Mode */}
        {quizState === 'active' && questions.length > 0 && (
          <div className="quiz-active-card">
            <div className="quiz-progress-header">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <button 
                type="button"
                onClick={handleSpeakQuestion}
                className="speak-question-btn" 
                title="Listen to question"
              >
                🔊 Read Aloud
              </button>
            </div>
            
            <div className="quiz-question-box">
              <h2>{questions[currentIdx].questionText}</h2>
            </div>

            <div className="quiz-options-list">
              {questions[currentIdx].options.map((option, idx) => {
                const isSelected = selectedOption === option
                const correctAns = questions[currentIdx].correctAnswer
                const isCorrect = option === correctAns
                
                let optionClass = ''
                if (isAnswered) {
                  if (isCorrect) optionClass = 'correct'
                  else if (isSelected) optionClass = 'incorrect'
                  else optionClass = 'disabled'
                }

                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    className={`quiz-option-btn ${optionClass}`}
                    disabled={isAnswered}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="option-text">{option}</span>
                  </button>
                )
              })}
            </div>

            {isAnswered && (
              <div className="quiz-action-footer">
                <button 
                  type="button"
                  onClick={handleNext} 
                  className="btn btn-primary quiz-next-btn"
                >
                  {currentIdx + 1 < questions.length ? 'Next Question →' : 'View Results'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Quiz Score Results */}
        {quizState === 'results' && (
          <div className="quiz-results-card">
            <div className="results-emoji">
              {score === questions.length ? '🏆' : score >= questions.length / 2 ? '🎉' : '📚'}
            </div>
            <h1>Quiz Completed!</h1>
            <p className="results-score-text">
              You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>
            </p>
            
            <div className="results-percentage">
              {Math.round((score / questions.length) * 100)}% Accuracy
            </div>

            <div className="results-actions">
              <button 
                type="button"
                onClick={handleRetake} 
                className="btn btn-primary"
              >
                🔄 Retake Quiz
              </button>
              <button 
                type="button"
                onClick={() => navigate('/student/home')} 
                className="btn btn-secondary"
              >
                🏠 Back to Home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Quiz
