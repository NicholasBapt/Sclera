import { Link } from 'react-router-dom'

export function NotFound() {
  return <main className="not-found"><span className="eyebrow">SCLERA / 404</span><h1>A little off <em>course.</em></h1><p>That page doesn't exist in this workspace.</p><Link className="action-button action-primary action-md" to="/dashboard">Back to overview</Link></main>
}
