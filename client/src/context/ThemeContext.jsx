import { useState, useEffect } from 'react'
import { ThemeContext } from './ThemeContextValue'

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || false
  )
  const [fontSize, setFontSize] = useState(
    parseInt(localStorage.getItem('fontSize')) || 16
  )

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light'
    )
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
    localStorage.setItem('fontSize', fontSize)
  }, [fontSize])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  const increaseFontSize = () => setFontSize(Math.min(fontSize + 2, 24))
  const decreaseFontSize = () => setFontSize(Math.max(fontSize - 2, 12))
  const resetFontSize = () => setFontSize(16)

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        fontSize,
        toggleTheme,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
