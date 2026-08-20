import "./SubjectDetails.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonService } from "../../services/lesson.service";
import { learningHistoryService } from "../../services/learningHistory.service";

const SubjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, [id]);

  const loadLessons = async () => {
    try {
      setLoading(true);

      const response = await lessonService.getAll(id);
      const fetchedLessons = response.data || [];
      setLessons(fetchedLessons);

      // Log lesson viewed event
      if (fetchedLessons.length > 0) {
        try {
          await learningHistoryService.logActivity({
            activityType: "lesson",
            title: `Lesson Materials Viewed: ${fetchedLessons[0].subject?.name || 'Subject'}`,
            subjectId: id,
            lessonId: fetchedLessons[0]._id,
          });
        } catch (logErr) {
          console.error("Error logging lesson view:", logErr);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="student-page">
        <h2>Loading lessons...</h2>
      </div>
    );
  }

  return (
    <div className="student-page">
      <div className="subject-header">
        <h1>📚 Subject Lessons</h1>

        <p>
          Browse your study materials and access your notes anytime.
        </p>

        <div className="lesson-count">
          {lessons.length} Lesson{lessons.length !== 1 ? "s" : ""} Available
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="empty-state">
          <h2>📄 No Lessons Available</h2>

          <p>
            Your teacher hasn't uploaded any study material for this subject
            yet.
          </p>
        </div>
      ) : (
        lessons.map((lesson) => (
          <div className="lesson-card" key={lesson._id}>
            <div className="lesson-icon">📄</div>

            <h2 className="lesson-title">
              📘 {lesson.title}
            </h2>

            <p className="lesson-description">
              {lesson.description || "No description available."}
            </p>

            <div className="lesson-meta">
              <span className="badge">
                🎯 {lesson.aiDifficulty || "Intermediate"}
              </span>

              <span className="badge">
                📚 {lesson.subject?.name || "Subject"}
              </span>

              <span className="badge">
                👨‍🏫 Faculty
              </span>

              <span className="badge">
                📅{" "}
                {lesson.createdAt
                  ? new Date(lesson.createdAt).toLocaleDateString()
                  : "Recently Uploaded"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                flexWrap: "wrap",
              }}
            >
              {lesson.fileUrl && (
                <a
                  className="open-btn"
                  href={`http://localhost:5000${lesson.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={async () => {
                    try {
                      await learningHistoryService.logActivity({
                        activityType: "summary",
                        title: `Summary Session: ${lesson.title}`,
                        subjectId: id,
                        lessonId: lesson._id,
                        details: {
                          fileUrl: lesson.fileUrl,
                        }
                      });
                    } catch (logErr) {
                      console.error("Error logging PDF session:", logErr);
                    }
                  }}
                >
                  📄 View Study Material
                </a>
              )}

              <button
                className="open-btn"
                onClick={() =>
                  navigate("/ai/tutor", {
  state: {
    lessonId: lesson._id,
    autoListen: true,
  },
})
                }
              >
                🤖 Ask AI About This Lesson
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SubjectDetails;