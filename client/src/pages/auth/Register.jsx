import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContextValue'
import { authService } from '../../services/auth.service'
import Button from '../../components/common/Button'
import { ROUTES } from '../../config/constant'
import './Auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
    branch: 'Computer Science (CSE)',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.role,
        formData.branch
      )
      login(response.user, response.token)
      navigate(formData.role === 'teacher' ? ROUTES.TEACHER_DASHBOARD : ROUTES.STUDENT_HOME)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Create STEMVision Account</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="branch">Select Branch *</label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >
              <option value="Computer Science (CSE)">Computer Science (CSE)</option>
              <option value="Information Technology (IT)">Information Technology (IT)</option>
              <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
              <option value="Electrical Engineering (EEE)">Electrical Engineering (EEE)</option>
              <option value="Mechanical Engineering (ME)">Mechanical Engineering (ME)</option>
              <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
              <option value="Data Science & AI (DS & AI)">Data Science & AI (DS & AI)</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="full-width">
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <p className="auth-link">
          Already have an account? <a href={ROUTES.LOGIN}>Login here</a>
        </p>
      </div>
    </div>
  )
}

export default Register
