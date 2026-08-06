import { ROUTES } from '../../config/constant'
import { useState, useContext } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContextValue'
import { authService } from '../../services/auth.service'
import Button from '../../components/common/Button'

import './Auth.css'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

const selectedRole =
  location.state?.role || 'Student'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(formData.email, formData.password)
      const actualRole = response.user.role.toLowerCase()
const expectedRole = selectedRole.toLowerCase()

if (actualRole !== expectedRole) {
  setError(
    `This account belongs to a ${response.user.role}. Please use the ${response.user.role} Login.`
  )
  return
}
      login(response.user, response.token)
      navigate(response.user.role === 'teacher' ? ROUTES.TEACHER_DASHBOARD : ROUTES.STUDENT_HOME)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" style={{ position: "relative" }}>
      <button
  onClick={() => navigate("/")}
  style={{
    position: "absolute",
    top: "25px",
    left: "25px",
    background: "transparent",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#2563eb",
    fontWeight: "600",
  }}
>
  ← Back
</button>
     
      <div className="auth-form">
        <h1>{selectedRole} Login</h1>

<p
  style={{
    marginBottom: '25px',
    color: '#666',
    textAlign: 'center',
  }}
>
  Welcome to STEMVision
</p>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
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

          <Button type="submit" disabled={loading} className="full-width">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to={ROUTES.REGISTER}>
  Register here
</Link>
        </p>
      </div>
      
    </div>
  )
}

export default Login
