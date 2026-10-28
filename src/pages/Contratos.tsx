import { Link } from 'react-router-dom'
import VisualIcon from '../components/ui/VisualIcon'

export function Contratos() {
  return <div className="page-stack"><section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> THE DETAILS <span className="eyebrow-index">/ 03</span></div><h1>Every agreement <em>matters.</em></h1><p>Contracts deserve the same clarity as the people connected to them.</p></div></section><section className="coming-soon"><div className="coming-soon-mark" aria-hidden="true"><VisualIcon name="contracts" size={56}/></div><span className="panel-overline">UPCOMING MODULE / 03</span><h2>Still taking shape<span>.</span></h2><p>Contract management hasn't been implemented yet. This space is reserved for agreements, dates and lifecycle information once the underlying API is ready.</p><Link to="/employees" className="action-button action-primary action-md">Return to people <VisualIcon name="arrow-up-right" size={17}/></Link><span className="coming-soon-foot">A GOOD SYSTEM GROWS WITH INTENTION.</span></section></div>
}
