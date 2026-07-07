import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AccessibilityProvider>
            <div className="app-container">
              <Navbar />
              <div className="app-content">
                <AppRoutes />
              </div>
            </div>
          </AccessibilityProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
