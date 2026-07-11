import { useEffect } from 'react'
import { subjectService } from '../../services/subject.service'
import { toList } from '../../utils/apiData'
import { useState } from 'react'
import './UploadForm.css'

const UploadForm = ({ onSubmit, isLoading = false }) => {
  const [subjects, setSubjects] = useState([])

const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'intermediate',
    file: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files?.[0],
    }))
  }
  useEffect(() => {
  const loadSubjects = async () => {
    try {
      const data = await subjectService.getAll()
      setSubjects(toList(data, ['subjects']))
    } catch (err) {
      console.error(err)
    }
  }

  loadSubjects()
}, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-group">
        <label htmlFor="title">Lesson Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        ></textarea>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject</option>

{subjects.map((subject) => (
  <option
    key={subject._id}
    value={subject._id}
  >
    {subject.name}
  </option>
))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="file">Upload File (PDF, PPT, Image) *</label>
        <input
          id="file"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png"
          required
        />
        {formData.file && <p className="file-selected">{formData.file.name}</p>}
      </div>

      <button type="submit" disabled={isLoading} className="submit-btn">
        {isLoading ? 'Uploading...' : 'Upload Lesson'}
      </button>
    </form>
  )
}

export default UploadForm
