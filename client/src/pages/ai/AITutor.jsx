import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import ChatBox from '../../components/ai/ChatBox'
import { aiService } from '../../services/ai.service'
import { getAssetUrl } from '../../config/constant'
import { learningHistoryService } from '../../services/learningHistory.service'
import Loader from '../../components/common/Loader'
import './AI.css'

// Helper to convert base64 Data URL back to a File object
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[arr.length - 1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

const AITutor = () => {
  const location = useLocation()

  const [initialMessage, setInitialMessage] = useState('')
  const [initialImageFile, setInitialImageFile] = useState(null)
  const [lessonId, setLessonId] = useState(null)
  const [autoListen, setAutoListen] = useState(false)

  // Sidebar and active chat states
  const [sidebarSessions, setSidebarSessions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [chatHistoryId, setChatHistoryId] = useState(null)
  const [initialMessages, setInitialMessages] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [loadingSidebar, setLoadingSidebar] = useState(true)

  const hasTriggeredRef = useRef(false)

  // Fetch sidebar sessions list
  const loadSidebar = async (selectLatest = false, forceId = null) => {
    try {
      const res = await learningHistoryService.getChatSessions()
      if (res.success && res.data) {
        setSidebarSessions(res.data)
        
        // Auto-select latest session on mount if there's no selected ID
        if (selectLatest && res.data.length > 0 && !forceId) {
          const latestId = res.data[0]._id
          setChatHistoryId(latestId)
          loadChatSession(latestId)
        }
      }
    } catch (e) {
      console.error('Failed to load chat sessions:', e)
    } finally {
      setLoadingSidebar(false)
    }
  }

  // Load selected chat session details
  const loadChatSession = async (historyId) => {
    try {
      setLoadingHistory(true)
      const res = await learningHistoryService.getChatSessionById(historyId)
      if (res.success && res.data) {
        if (res.data.lesson) {
          setLessonId(res.data.lesson._id || res.data.lesson)
        } else {
          setLessonId(null)
        }
        
        const formatted = (res.data.messages || []).map(m => ({
          sender: m.sender,
          text: m.text,
          image: m.image ? getAssetUrl(m.image) : null,
          timestamp: new Date(m.createdAt),
        }))
        setInitialMessages(formatted)
      }
    } catch (e) {
      console.error('Failed to load chat history:', e)
    } finally {
      setLoadingHistory(false)
    }
  }

  // Mount logic
  useEffect(() => {
    const handleMount = async () => {
      let forceId = null
      let selectLatest = true
      
      if (location.state && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true
        selectLatest = false

        if (location.state.chatHistoryId) {
          forceId = location.state.chatHistoryId
          setChatHistoryId(forceId)
          loadChatSession(forceId)
        }

        if (location.state.initialMessage) {
          setInitialMessage(location.state.initialMessage)
        }
        if (location.state.lessonId) {
          setLessonId(location.state.lessonId)
        }
        if (location.state.autoListen) {
          setAutoListen(true)
        }
        if (location.state.initialImage) {
          try {
            const file = dataURLtoFile(
              location.state.initialImage,
              location.state.initialImageName || 'diagram.png'
            )
            setInitialImageFile(file)
          } catch (e) {
            console.error('Error parsing initial image file:', e)
          }
        }
        window.history.replaceState({}, document.title)
      }

      // Load sidebar and auto-select latest if no chat is forced
      await loadSidebar(selectLatest && !forceId, forceId)
    }

    handleMount()
  }, [location])

  // Handle sidebar session click
  const handleSessionClick = (id) => {
    if (id === chatHistoryId) return
    setChatHistoryId(id)
    loadChatSession(id)
  }

  // Handle New Chat action (clears state, does not write to DB immediately)
  const handleNewChat = () => {
    setChatHistoryId(null)
    setInitialMessages([])
    setLessonId(null)
    setInitialMessage('')
    setInitialImageFile(null)
  }

  // Handle send message logic (text or vision)
  const handleSendMessage = async (message, imageFile = null) => {
    let response
    
    if (imageFile) {
      response = await aiService.explainDiagram(
        imageFile,
        message || '',
        chatHistoryId
      )
    } else {
      response = await aiService.chat(message, lessonId, chatHistoryId)
    }

    // Capture conversation ID (updates if a new session was created)
    if (response.chatHistoryId && response.chatHistoryId !== chatHistoryId) {
      setChatHistoryId(response.chatHistoryId)
    }

    // Refresh sidebar to reflect latest activity order
    loadSidebar(false, response.chatHistoryId || chatHistoryId)

    if (imageFile) {
      return (
        response.description ||
        response.summary ||
        'No explanation could be generated.'
      )
    }

    return (
      response.answer ||
      response.response ||
      response.message ||
      'No response received.'
    )
  }

  // Grouping helper for sidebar sessions list
  const groupSessions = (sessions) => {
    const groups = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'This Month': [],
      'Older': [],
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const yesterday = today - 24 * 60 * 60 * 1000
    const sevenDaysAgo = today - 6 * 24 * 60 * 60 * 1000
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

    sessions.forEach((session) => {
      const time = new Date(session.lastActivity || session.updatedAt).getTime()
      if (time >= today) {
        groups['Today'].push(session)
      } else if (time >= yesterday) {
        groups['Yesterday'].push(session)
      } else if (time >= sevenDaysAgo) {
        groups['Previous 7 Days'].push(session)
      } else if (time >= startOfMonth) {
        groups['This Month'].push(session)
      } else {
        groups['Older'].push(session)
      }
    })

    return groups
  }

  // Filter sessions by search query
  const filteredSessions = sidebarSessions.filter((session) => {
    if (!searchQuery.trim()) return true
    return session.title?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const groupedSessions = groupSessions(filteredSessions)

  return (
    <div className="ai-page-layout">
      
      {/* Left Sidebar */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <button onClick={handleNewChat} className="new-chat-btn">
            ➕ New Chat
          </button>
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sidebar-search-input"
          />
        </div>

        <div className="sidebar-sessions-list">
          {loadingSidebar ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="sidebar-empty-state">No conversations found</div>
          ) : (
            Object.keys(groupedSessions).map((groupName) => {
              const groupList = groupedSessions[groupName]
              if (groupList.length === 0) return null

              return (
                <div key={groupName} className="sidebar-group">
                  <h3 className="sidebar-group-title">{groupName}</h3>
                  <div className="sidebar-group-list">
                    {groupList.map((session) => {
                      const isActive = session._id === chatHistoryId
                      const dateStr = new Date(session.lastActivity || session.updatedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })

                      return (
                        <button
                          key={session._id}
                          onClick={() => handleSessionClick(session._id)}
                          className={`sidebar-chat-item ${isActive ? 'active' : ''}`}
                        >
                          <span className="sidebar-chat-title">{session.title}</span>
                          <div className="sidebar-chat-meta">
                            <span>{session.lesson?.title ? `📖 ${session.lesson.title.substring(0, 18)}` : 'Study Chat'}</span>
                            <span>{dateStr}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </aside>

      {/* Right Chat Panel */}
      <main className="chat-main">
        <div className="ai-container">
          <div className="ai-header">
            <h1>AI Tutor</h1>
            <p>Ask any questions about your lessons</p>
          </div>

          {loadingHistory ? (
            <Loader />
          ) : (
            <ChatBox
              onSendMessage={handleSendMessage}
              initialMessage={initialMessage}
              initialImage={initialImageFile}
              autoListen={autoListen}
              lessonLoaded={!!lessonId || initialMessages.length > 0}
              initialMessages={initialMessages}
            />
          )}
        </div>
      </main>

    </div>
  )
}

export default AITutor