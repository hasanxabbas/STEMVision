import { useContext } from "react";
import { AccessibilityContext } from "../../context/AccessibilityContextValue";
import "./AccessibilityPanel.css";

const AccessibilityPanel = ({ isOpen, onClose }) => {
    console.log("Panel rendered", isOpen)
    console.log("Accessibility panel open:", isOpen);
  const {
    fontSize,
    setFontSize,
    colorVisionMode,
    setColorVisionMode,
    speechRate,
    setSpeechRate,
    language,
    setLanguage,
    highContrast,
    toggleHighContrast,
  } = useContext(AccessibilityContext);

  return (
    <div
  className={`accessibility-panel ${isOpen ? "open" : ""}`}
  onClick={(e) => e.stopPropagation()}
>
      <div className="panel-header">
        <h2>Accessibility</h2>

        <button onClick={onClose}>✕</button>
      </div>

      {/* Font Size */}

      <div className="setting">
        <label>🔠 Font Size</label>

        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="extra-large">Extra Large</option>
        </select>
      </div>

      {/* Color Vision */}

      <div className="setting">
        <label>🎨 Color Vision</label>

        <select
          value={colorVisionMode}
          onChange={(e) => setColorVisionMode(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="protanopia">Protanopia</option>
          <option value="deuteranopia">Deuteranopia</option>
          <option value="tritanopia">Tritanopia</option>
        </select>
      </div>

      {/* Speech */}

      <div className="setting">
        <label>🔊 Speech Speed</label>

        <input
          type="range"
          min="0.5"
          max="2"
          step="0.25"
          value={speechRate}
          onChange={(e) => setSpeechRate(Number(e.target.value))}
        />

        <p>{speechRate}x</p>
      </div>

      {/* Language */}

      <div className="setting">
        <label>🌍 Language</label>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Urdu</option>
        </select>
      </div>

      {/* High Contrast */}

      <div className="setting">
        <button onClick={toggleHighContrast}>
          {highContrast ? "Disable" : "Enable"} High Contrast
        </button>
      </div>
    </div>
  );
};

export default AccessibilityPanel;