import { useCallback, useEffect, useState } from 'react'
import LessonTable from '../../components/teacher/LessonTable'
import { lessonService } from '../../services/lesson.service'
import { getApiMessage, getItemId, toList } from '../../utils/apiData'
import './Teacher.css'

const ManageLessons = () => {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadLessons = useCallback(async () => {
    try {
      const data = await lessonService.getAll()
      setLessons(toList(data, ['lessons']))
      setMessage(getApiMessage(data, ''))
    } catch {
      setMessage('Unable to load lessons right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadLessons, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadLessons])

  const handleDelete = async (id) => {
    if (!id) return

    try {
      const data = await lessonService.delete(id)
      setMessage(getApiMessage(data, 'Lesson deleted successfully.'))
      await loadLessons()
    } catch {
      setMessage('Unable to delete lesson right now.')
    }
  }

  const handleEdit = (lesson) => {
    setMessage(`Edit selected for ${lesson.title || 'this lesson'}.`)
  }

  return (
    <div className="teacher-page">
      <div className="page-header">
        <h1>Manage Lessons</h1>
        <p>Review uploaded lessons and learning materials</p>
      </div>

      {message && <p className="status-message">{message}</p>}

      <LessonTable
        lessons={lessons}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id || getItemId(id))}
      />
    </div>
  )
}

export default ManageLessons
