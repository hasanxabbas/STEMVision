import { getItemId } from '../../utils/apiData'
import './LessonTable.css'

const formatDate = (value) => {
  if (!value) return 'Not set'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not set' : date.toLocaleDateString()
}

const getSubjectName = (subject) => {
  if (!subject) return 'Unassigned'
  if (typeof subject === 'string') return subject
  return subject.name || subject.title || 'Unassigned'
}

const LessonTable = ({ lessons, onEdit, onDelete, isLoading }) => {
  if (isLoading) return <div>Loading lessons...</div>

  if (!lessons || lessons.length === 0) {
    return <p className="no-data">No lessons found. Create one to get started!</p>
  }

  return (
    <div className="table-wrapper">
      <table className="lesson-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Difficulty</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => {
            const lessonId = getItemId(lesson)

            return (
              <tr key={lessonId}>
                <td>{lesson.title || 'Untitled Lesson'}</td>
                <td>{getSubjectName(lesson.subject)}</td>
                <td>{lesson.difficulty || 'Not set'}</td>
                <td>{formatDate(lesson.date || lesson.createdAt)}</td>
                <td className="actions">
                  <button
                    onClick={() => onEdit?.(lesson)}
                    className="edit-btn"
                    aria-label="Edit lesson"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(lessonId)}
                    className="delete-btn"
                    aria-label="Delete lesson"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default LessonTable
