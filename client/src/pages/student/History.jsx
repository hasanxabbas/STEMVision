import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import { learningHistoryService } from '../../services/learningHistory.service'
import { BACKEND_URL } from '../../config/constant'
import { toList } from '../../utils/apiData'
import './Student.css'

const History = () => {
  const navigate = useNavigate()
  const [rawHistory, setRawHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true)
      const data = await learningHistoryService.getHistory()
      setRawHistory(toList(data, ['history', 'attempts']))
    } catch (err) {
      console.error(err)
      setError('Unable to load your learning history right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // Click handler for history items
  const handleItemClick = (item) => {
    if (item.activityType === 'ai_chat') {
      const historyId = item.details?.chatHistoryId?._id || item.details?.chatHistoryId
      if (historyId) {
        navigate('/ai/tutor', {
          state: {
            chatHistoryId: historyId,
          },
        })
      }
    } else if (item.activityType === 'quiz') {
      if (item.lessonId?._id || item.lessonId) {
        navigate('/ai/quiz')
      }
    } else if (item.activityType === 'lesson') {
      const subjectId = item.subject?._id || item.subject
      if (subjectId) {
        navigate(`/student/subjects/${subjectId}`)
      }
    } else if (item.details?.fileUrl) {
      window.open(`${BACKEND_URL}${item.details.fileUrl}`, '_blank')
    }
  }

  // Filter and search logic
  const filteredHistory = rawHistory.filter((item) => {
    // 1. Category Filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'ai_chats' && item.activityType !== 'ai_chat') return false
      if (activeFilter === 'quizzes' && item.activityType !== 'quiz') return false
      if (activeFilter === 'lessons' && item.activityType !== 'lesson') return false
      if (activeFilter === 'diagrams' && item.activityType !== 'diagram') return false
      if (activeFilter === 'summaries' && item.activityType !== 'summary') return false
    }

    // 2. Search Query (Title, Lesson, Subject)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const titleMatch = item.title?.toLowerCase().includes(query)
      const lessonMatch = item.lessonId?.title?.toLowerCase().includes(query)
      const subjectMatch = item.subject?.name?.toLowerCase().includes(query)
      
      return titleMatch || lessonMatch || subjectMatch
    }

    return true
  })

  // Date Grouping logic
  const groupHistory = (items) => {
    const groups = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'Earlier': [],
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const yesterday = today - 24 * 60 * 60 * 1000
    const oneWeekAgo = today - 6 * 24 * 60 * 60 * 1000

    items.forEach((item) => {
      const time = new Date(item.createdAt).getTime()
      if (time >= today) {
        groups['Today'].push(item)
      } else if (time >= yesterday) {
        groups['Yesterday'].push(item)
      } else if (time >= oneWeekAgo) {
        groups['This Week'].push(item)
      } else {
        groups['Earlier'].push(item)
      }
    })

    return groups
  }

  const groupedItems = groupHistory(filteredHistory)
  const hasItems = filteredHistory.length > 0

  // Activity Type mapping helper
  const getActivityMeta = (type) => {
    switch (type) {
      case 'ai_chat':
        return { label: 'AI Tutor', icon: '🧠', class: 'badge-ai' }
      case 'quiz':
        return { label: 'Quiz', icon: '📝', class: 'badge-quiz' }
      case 'lesson':
        return { label: 'Lesson Viewed', icon: '📚', class: 'badge-lesson' }
      case 'diagram':
        return { label: 'Diagram Explained', icon: '🖼', class: 'badge-diagram' }
      case 'summary':
        return { label: 'Lesson Summary', icon: '📄', class: 'badge-summary' }
      default:
        return { label: 'Activity', icon: '⚡', class: 'badge-default' }
    }
  }

  if (loading) return <Loader />

  return (
    <div className="student-page history-page">
      <div className="page-header">
        <h1>Learning History</h1>
        <p>Your complete timeline of study sessions, AI chats, and quizzes</p>
      </div>

      {error && <p className="status-message">{error}</p>}

      {/* Search and Filters panel */}
      <div className="history-controls-card">
        <div className="history-search-wrapper">
          <input
            type="text"
            placeholder="Search by title, lesson or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="history-search-input"
          />
        </div>
        
        <div className="history-filter-chips">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'ai_chats', label: 'AI Chats 🧠' },
            { id: 'quizzes', label: 'Quizzes 📝' },
            { id: 'lessons', label: 'Lessons 📚' },
            { id: 'diagrams', label: 'Diagrams 🖼' },
            { id: 'summaries', label: 'PDF Study 📄' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`filter-chip ${activeFilter === chip.id ? 'active' : ''}`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Timeline */}
      <div className="history-timeline">
        {!hasItems ? (
          <div className="empty-state history-empty">
            <h2>🔍 No learning history yet</h2>
            <p>Start learning with STEMVision and your study sessions will appear here.</p>
          </div>
        ) : (
          Object.keys(groupedItems).map((groupName) => {
            const groupList = groupedItems[groupName]
            if (groupList.length === 0) return null

            return (
              <div key={groupName} className="timeline-group">
                <h2 className="timeline-group-title">{groupName}</h2>
                <div className="timeline-items-grid">
                  {groupList.map((item) => {
                    const meta = getActivityMeta(item.activityType)
                    const formattedTime = new Date(item.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })

                    return (
                      <article
                        className={`history-card-item ${item.activityType}`}
                        key={item._id}
                        onClick={() => handleItemClick(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleItemClick(item)
                        }}
                      >
                        <div className="card-top-row">
                          <span className={`activity-pill ${meta.class}`}>
                            {meta.icon} {meta.label}
                          </span>
                          <span className="activity-time">{formattedTime}</span>
                        </div>

                        <h3 className="card-item-title">{item.title}</h3>

                        <div className="card-bottom-row">
                          <span className="badge subject-badge">
                            📁 {item.subject?.name || (item.lessonId?.subject?.name || 'General')}
                          </span>
                          {item.activityType === 'quiz' && item.details && (
                            <span className="badge score-badge">
                              🎯 Score: {item.details.score}/{item.details.totalQuestions} ({Math.round((item.details.score / item.details.totalQuestions) * 100)}%)
                            </span>
                          )}
                          {item.activityType === 'ai_chat' && item.details?.chatHistoryId && (
                            <span className="resume-prompt">
                              Click to resume chat 💬
                            </span>
                          )}
                          {item.details?.fileUrl && (
                            <span className="resume-prompt">
                              Click to view attachment 📄
                            </span>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default History
