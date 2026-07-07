const NotificationCard = ({ notification, onDismiss }) => {
  return (
    <div className="notification-card">
      <div className="notification-content">
        <h4>{notification.title}</h4>
        <p>{notification.message}</p>
        <small>{new Date(notification.date).toLocaleDateString()}</small>
      </div>
      <button
        className="dismiss-btn"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  )
}

export default NotificationCard
