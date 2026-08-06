import { useState, useContext, useEffect, useRef } from 'react'
import AccessibilityPanel from './AccessibilityPanel'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContextValue'
import { ThemeContext } from '../../context/ThemeContextValue'
import { ROUTES, USER_ROLES } from '../../config/constant'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)

  const navigate = useNavigate()
  const location = useLocation()

  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    'Student'

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  // Always call hooks before any conditional return
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])

  const hideNavbar =
    location.pathname === ROUTES.LOGIN ||
    location.pathname === ROUTES.REGISTER

  if (hideNavbar) {
    return null
  }

  return (
    <>
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
                    <Link
                      to={ROUTES.STUDENT_HOME}
                      className="nav-link"
                    >
                      Home
                    </Link>

                    <Link
                      to={ROUTES.STUDENT_SUBJECTS}
                      className="nav-link"
                    >
                      Subjects
                    </Link>

                    <Link
                      to={ROUTES.AI_TUTOR}
                      className="nav-link"
                    >
                      AI Tutor
                    </Link>

                    <Link
                      to={ROUTES.STUDENT_HISTORY}
                      className="nav-link"
                    >
                      History
                    </Link>
                  </>
                )}

                {user.role === USER_ROLES.TEACHER && (
                  <>
                    <Link
                      to={ROUTES.TEACHER_DASHBOARD}
                      className="nav-link"
                    >
                      Dashboard
                    </Link>

                    <Link
                      to={ROUTES.TEACHER_MANAGE_SUBJECTS}
                      className="nav-link"
                    >
                      Subjects
                    </Link>

                    <Link
                      to={ROUTES.TEACHER_UPLOAD_NOTES}
                      className="nav-link"
                    >
                      Upload Notes
                    </Link>
                  </>
                )}
              </div>

              <div className="navbar-controls">
                <button
                  className="control-btn"
                  onClick={toggleTheme}
                  title="Toggle Theme"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </button>

                <button
                  className="control-btn"
                  onClick={() => setIsAccessibilityOpen(true)}
                  title="Accessibility"
                >
                  ♿
                </button>

                <div
                  className="user-menu"
                  ref={dropdownRef}
                >
                  <button
                    className="user-btn"
                    onClick={() =>
                      setIsDropdownOpen(!isDropdownOpen)
                    }
                  >
                    👤

                    <span className="user-name">
                      {displayName}
                    </span>

                    <span className="arrow">
                      {isDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="dropdown">
                      <div className="dropdown-header">
                        <strong>{displayName}</strong>
                        <small>{user.role}</small>
                      </div>

                      <Link
                        to={ROUTES.STUDENT_PROFILE}
                        className="dropdown-item"
                        onClick={() =>
                          setIsDropdownOpen(false)
                        }
                      >
                        👤 Profile
                      </Link>

                      <button
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AccessibilityPanel
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />
    </>
  )
}

export default Navbar