import SpeechButton from '../accessibility/SpeechButton'

const VoiceButton = ({ onVoiceInput }) => {
  const handleSpeechResult = (transcript) => {
    onVoiceInput?.(transcript)
  }

  return (
    <div className="voice-button-container">
      <SpeechButton onSpeechResult={handleSpeechResult} />
    </div>
  )
}

export default VoiceButton
