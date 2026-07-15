import ReactMarkdown from 'react-markdown'
import TalkBackButton from '../accessibility/TalkBackButton'
import './MessageBubble.css'

const MessageBubble = ({ message, sender = 'user' }) => {
  return (
    <div className={`message-bubble ${sender}`}>
      <div className="message-content">
        {message.text && (
          <>
            <ReactMarkdown>{message.text}</ReactMarkdown>

            {sender === 'ai' && (
              <TalkBackButton text={message.text} />
            )}
          </>
        )}

        {message.image && (
          <img
            src={message.image}
            alt="Message"
          />
        )}
      </div>

      <small className="message-time">
        {new Date(message.timestamp).toLocaleTimeString()}
      </small>
    </div>
  )
}

export default MessageBubble