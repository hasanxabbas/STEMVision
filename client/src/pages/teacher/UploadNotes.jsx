import { useState } from 'react'
import UploadForm from '../../components/teacher/UplaodForm'
import { lessonService } from '../../services/lesson.service'
import './Teacher.css'

const UploadNotes = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('subject', data.subject)
    formData.append('difficulty', data.difficulty)
    formData.append('file', data.file)

    try {
      setLoading(true)
      const response = await lessonService.upload(formData)
      setMessage(response.message || 'Lesson uploaded successfully.')
    } catch {
      setMessage('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="teacher-page">
      <div className="page-header">
        <h1>Upload Lesson Notes</h1>
        <p>Add new learning materials for your students</p>
      </div>

      {message && <p className="status-message">{message}</p>}
      <UploadForm onSubmit={handleUpload} isLoading={loading} />
    </div>
  )
}

export default UploadNotes
