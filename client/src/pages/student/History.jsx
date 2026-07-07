import { useCallback, useEffect, useState } from 'react'
import Loader from '../../components/common/Loader'
import { quizService } from '../../services/quiz.service'
import { getApiMessage, getItemId, toList } from '../../utils/apiData'
import './Student.css'

const History = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadHistory = useCallback(async () => {
    try {
      const data = await quizService.getHistory()
      setHistory(toList(data, ['history', 'attempts']))
      setMessage(getApiMessage(data, ''))
    } catch {
      setMessage('Unable to load learning history right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadHistory, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadHistory])

  if (loading) return <Loader />

  return (
    <div className="student-page">
      <div className="page-header">
        <h1>Learning History</h1>
        <p>Track your recent quizzes and study activity</p>
      </div>

      {message && <p className="status-message">{message}</p>}

      <div className="history-list">
        {history.length === 0 && (
          <p className="empty-state">Your learning history will appear here.</p>
        )}

        {history.map((item) => (
          <article className="history-item" key={getItemId(item)}>
            <h3>{item.title || item.lessonTitle || 'Learning activity'}</h3>
            <p>{item.description || item.result || 'Activity completed.'}</p>
            <span>{item.date || item.createdAt || 'Recent'}</span>
          </article>
        ))}
      </div>
    </div>
  )
}

export default History
