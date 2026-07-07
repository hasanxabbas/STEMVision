
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContextValue'
import './Student.css'

const Profile = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="student-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Your STEMVision account details</p>
      </div>

      <div className="profile-section">
        <p>
          <strong>Name:</strong> {user?.fullName || 'Student'}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || 'Not available'}
        </p>
        <p>
          <strong>Role:</strong> {user?.role || 'student'}
        </p>
      </div>
    </div>
  )
}

export default Profile
