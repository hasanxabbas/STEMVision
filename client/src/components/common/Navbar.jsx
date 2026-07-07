import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContextValue'
import { ThemeContext } from '../../context/ThemeContextValue'
import { AccessibilityContext } from '../../context/AccessibilityContextValue'
import { ROUTES, USER_ROLES } from '../../config/constant'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)
  const { toggleHighContrast } = useContext(AccessibilityContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">STEMVision</span>
        </Link>

        {user && (
          <div className="navbar-menu">
            <div className="navbar-nav">
              {user.role === USER_ROLES.STUDENT && (
                <>
                  <Link to={ROUTES.STUDENT_HOME} className="nav-link">
                    Home
                  </Link>
                  <Link to={ROUTES.STUDENT_SUBJECTS} className="nav-link">
                    Subjects
                  </Link>
                  <Link to={ROUTES.AI_TUTOR} className="nav-link">
                    AI Tutor
                  </Link>
                  <Link to={ROUTES.STUDENT_HISTORY} className="nav-link">
                    History
                  </Link>
                </>
              )}

              {user.role === USER_ROLES.TEACHER && (
                <>
                  <Link to={ROUTES.TEACHER_DASHBOARD} className="nav-link">
                    Dashboard
                  </Link>
                  <Link
                    to={ROUTES.TEACHER_MANAGE_SUBJECTS}
                    className="nav-link"
                  >
                    Subjects
                  </Link>
                  <Link to={ROUTES.TEACHER_UPLOAD_NOTES} className="nav-link">
                    Upload Notes
                  </Link>
                </>
              )}
            </div>

            <div className="navbar-controls">
              <button
                className="control-btn"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button
                className="control-btn"
                onClick={toggleHighContrast}
                aria-label="Toggle high contrast"
                title="Toggle high contrast"
              >
                ◎
              </button>

              <div className="user-menu">
                <button className="user-btn">
                  {user.fullName} ({user.role})
                </button>
                <div className="dropdown">
                  <Link to={ROUTES.STUDENT_PROFILE} className="dropdown-item">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
