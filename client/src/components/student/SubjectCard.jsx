const SubjectCard = ({ subject, lessonCount, onClick }) => {
  return (
    <div
      className="subject-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="subject-icon">Book</div>

      <h3>{subject.name || subject.title || "Untitled Subject"}</h3>

      <p className="subject-description">
        {subject.description || "Lessons will appear here when available."}
      </p>

      <div className="subject-footer">
        <span className="lesson-count">
          {lessonCount || 0} lessons
        </span>
      </div>
    </div>
  )
}

export default SubjectCard