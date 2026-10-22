import { NavLink } from 'react-router-dom'
import VisualIcon, { type IconName } from './ui/VisualIcon'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

const navigation: { to: string; label: string; icon: IconName; number: string }[] = [
  { to: '/dashboard', label: 'Overview', icon: 'overview', number: '01' },
  { to: '/employees', label: 'People', icon: 'people', number: '02' },
  { to: '/contratos', label: 'Contracts', icon: 'contracts', number: '03' },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && <button aria-label="Close navigation" className="sidebar-scrim" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-upper">
          <NavLink to="/dashboard" onClick={onClose} className="brand-lockup">
            <span className="brand-mark" aria-hidden="true"><span/><span/><span/></span>
            <span className="brand-name">sclera<span className="brand-period">.</span></span>
          </NavLink>
          <p className="sidebar-caption">PEOPLE INTELLIGENCE</p>
          <div className="sidebar-section-label">WORKSPACE <span>01 / 03</span></div>
          <nav aria-label="Main navigation" className="sidebar-links">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              >
                <span className="sidebar-link-icon"><VisualIcon name={item.icon} size={19} /></span>
                <span className="sidebar-link-label">{item.label}</span>
                <span className="sidebar-link-number">{item.number}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sidebar-lower">
          <div className="sidebar-note">
            <span className="sidebar-note-symbol"><VisualIcon name="spark" size={21} /></span>
            <p>Clarity for the<br/><em>people behind</em><br/>the numbers.</p>
            <span className="sidebar-note-line" />
            <span className="sidebar-note-small">BUILT FOR BETTER DECISIONS</span>
          </div>
          <div className="sidebar-footer"><span className="online-indicator"/> LOCAL WORKSPACE <span>V.01</span></div>
        </div>
      </aside>
    </>
  )
}
