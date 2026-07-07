import { useState } from 'react'
import './Sidebar.css'

const Sidebar = ({ children, isOpen = true }) => {
  const [open, setOpen] = useState(isOpen)

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
        {children}
      </aside>
    </>
  )
}

export default Sidebar
