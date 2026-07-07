const SubjectCard = ({ subject, onClick, lessonCount }) => {
  return (
    <div className="subject-card" onClick={onClick}>
      <div className="subject-icon" aria-hidden="true">
        Book
      </div>
      <h3>{subject.name || subject.title || 'Untitled Subject'}</h3>
      <p className="subject-description">
        {subject.description || 'Lessons will appear here when available.'}
      </p>
      <div className="subject-footer">
        <span className="lesson-count">{lessonCount || 0} lessons</span>
      </div>
    </div>
  )
}

export default SubjectCard
