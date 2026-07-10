import { ROUTES } from '../../config/constant'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
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
     
      <div className="auth-form">
        <h1>STEMVision Login</h1>
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
          Don't have an account? <a href={ROUTES.REGISTER}>Register here</a>
        </p>
      </div>
      
    </div>
  )
}

export default Login
