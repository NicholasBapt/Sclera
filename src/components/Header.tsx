import { useLocation } from 'react-router-dom'
import VisualIcon from './ui/VisualIcon'

type HeaderProps = { onMenuClick: () => void }

const pageNames: Record<string, string> = {
  '/dashboard': 'Overview',
  '/employees': 'People',
  '/contratos': 'Contracts',
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const title = pageNames[location.pathname] ?? 'Overview'
  const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" onClick={onMenuClick} aria-label="Open navigation" className="mobile-menu-button"><VisualIcon name="menu" /></button>
        <span className="topbar-kicker">WORKSPACE</span>
        <span className="topbar-slash">/</span>
        <span className="topbar-current">{title}</span>
      </div>
      <div className="topbar-right">
        <span className="topbar-date">{date}</span>
        <span className="topbar-divider" />
        <div className="topbar-user"><span className="user-avatar">S</span><div><strong>Sclera workspace</strong><small>Local development</small></div></div>
      </div>
    </header>
  )
}
