import './LessonCard.css'

const LessonCard = ({ lesson, onClick, isBookmarked, onBookmark }) => {
  return (
    <div className="lesson-card" onClick={onClick}>
      <div className="lesson-header">
        <h3>{lesson.title}</h3>
        <button
          className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onBookmark?.(lesson.id)
          }}
          aria-label="Bookmark lesson"
        >
          ⭐
        </button>
      </div>
      <p className="lesson-description">{lesson.description}</p>
      <div className="lesson-meta">
        <span className="subject">{lesson.subject}</span>
        <span className="difficulty">{lesson.difficulty}</span>
      </div>
    </div>
  )
}

export default LessonCard
