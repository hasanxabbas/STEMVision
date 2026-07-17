import { useState } from 'react'
import UploadForm from '../../components/teacher/UplaodForm'
import { lessonService } from '../../services/lesson.service'
import './Teacher.css'

const UploadNotes = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async (data) => {
    const formData = new FormData()

    formData.append('file', data.file)

    try {
      setLoading(true)

      // Step 1: Upload the file
      const uploadResponse = await lessonService.upload(formData)

      // Step 2: Create the lesson with the returned fileUrl
      await lessonService.create({
        title: data.title,
        description: data.description,
        subject: data.subject,
        difficulty: data.difficulty,
        fileUrl: uploadResponse.fileUrl,
      })

      setMessage('Lesson uploaded successfully.')
    } catch (error) {
      console.error(error)
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

      <UploadForm
        onSubmit={handleUpload}
        isLoading={loading}
      />
    </div>
  )
}

export default UploadNotes