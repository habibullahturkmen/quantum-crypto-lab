import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === 'light' ? '☾' : '☀'}
      </span>
      <span className="theme-toggle-label">
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}
