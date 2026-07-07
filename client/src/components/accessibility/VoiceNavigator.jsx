import { useContext } from 'react'
import { AccessibilityContext } from '../../context/AccessibilityContextValue'

const VoiceNavigator = ({ enabled = false }) => {
  const { speak } = useContext(AccessibilityContext)

  const handleCommand = (command) => {
    speak(`Navigating to ${command}`)
    // Handle navigation based on command
  }

  if (!enabled) return null

  return (
    <div className="voice-navigator">
      <p>Say a command to navigate</p>
      <div className="command-hints">
        {['Home', 'Subjects', 'Tutor', 'History'].map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => handleCommand(command)}
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  )
}

export default VoiceNavigator
