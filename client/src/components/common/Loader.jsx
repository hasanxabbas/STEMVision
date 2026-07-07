const Loader = ({ fullScreen = false }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loader">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  )
}

export default Loader
