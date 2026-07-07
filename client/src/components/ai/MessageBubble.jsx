import './MessageBubble.css'

const MessageBubble = ({ message, sender = 'user' }) => {
  return (
    <div className={`message-bubble ${sender}`}>
      <div className="message-content">
        {message.text && <p>{message.text}</p>}
        {message.image && <img src={message.image} alt="Message" />}
      </div>
      <small className="message-time">
        {new Date(message.timestamp).toLocaleTimeString()}
      </small>
    </div>
  )
}

export default MessageBubble
