import { useCallback, useEffect, useState } from 'react'
import Loader from '../../components/common/Loader'
import { subjectService } from '../../services/subject.service'
import { getApiMessage, getItemId, toList } from '../../utils/apiData'
import './Teacher.css'

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const loadSubjects = useCallback(async () => {
    try {
      const data = await subjectService.getAll()
      setSubjects(toList(data, ['subjects']))
      setMessage(getApiMessage(data, ''))
    } catch {
      setMessage('Unable to load subjects right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadSubjects, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadSubjects])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const data = await subjectService.create(formData)
      setMessage(getApiMessage(data, 'Subject saved successfully.'))
      setFormData({ name: '', description: '' })
      await loadSubjects()
    } catch {
      setMessage('Unable to save subject right now.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!id) return

    try {
      const data = await subjectService.delete(id)
      setMessage(getApiMessage(data, 'Subject deleted successfully.'))
      await loadSubjects()
    } catch {
      setMessage('Unable to delete subject right now.')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="teacher-page">
      <div className="page-header">
        <h1>Manage Subjects</h1>
        <p>Create and organize subject areas for students</p>
      </div>

      <form className="teacher-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Subject Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
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
            rows="3"
          />
        </div>
        <button className="btn btn-primary" disabled={saving} type="submit">
          {saving ? 'Saving...' : 'Save Subject'}
        </button>
      </form>

      {message && <p className="status-message">{message}</p>}

      <div className="teacher-list">
        {subjects.length === 0 && (
          <p className="empty-state">No subjects have been created yet.</p>
        )}

        {subjects.map((subject) => (
          <article className="teacher-list-item" key={getItemId(subject)}>
            <div>
              <h3>{subject.name || subject.title || 'Untitled Subject'}</h3>
              <p>{subject.description || 'No description added.'}</p>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(getItemId(subject))}
              type="button"
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ManageSubjects
