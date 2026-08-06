import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-card">

        <h1>STEMVision</h1>

        <p className="subtitle">
          AI Powered Learning Platform
        </p>

        <h2>Choose Your Role</h2>

        <button
          className="role-btn student"
          onClick={() =>
            navigate("/login", {
              state: {
                role: "Student",
              },
            })
          }
        >
          👨‍🎓 Student
        </button>

        <button
          className="role-btn teacher"
          onClick={() =>
            navigate("/login", {
              state: {
                role: "Teacher",
              },
            })
          }
        >
          👨‍🏫 Teacher
        </button>

      </div>
    </div>
  );
};

export default Landing;