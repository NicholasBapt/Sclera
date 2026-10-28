import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SimpleBarChart from '../components/Charts/SimpleBarChart'
import SimpleLineChart from '../components/Charts/SimpleLineChart'
import VisualIcon from '../components/ui/VisualIcon'
import payrollCostOverTime from '../data/payrollCostOverTime.json'
import { getEmployees, type Employee } from '../services/api'

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()
}

export function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getEmployees().then(setEmployees).catch(() => setError('Could not connect to the employee database. Check your local API.')).finally(() => setLoading(false))
  }, [])

  const departments = Object.entries(employees.reduce<Record<string, number>>((counts, employee) => {
    const name = employee.department || 'Unassigned'
    counts[name] = (counts[name] ?? 0) + 1
    return counts
  }, {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

  const present = employees.filter(e => e.status === 'present').length
  const away = employees.filter(e => e.status === 'absent').length
  const leave = employees.filter(e => e.status === 'leave').length
  const total = employees.length
  const ready = !loading && !error
  const number = (value: number) => loading ? '—' : error ? '—' : String(value).padStart(2, '0')

  return (
    <div className="page-stack">
      <section className="page-heading dashboard-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-line"/> THE BIG PICTURE <span className="eyebrow-index">/ 01</span></div>
          <h1>People, in <em>perspective.</em></h1>
          <p>A clearer view of your workforce. The numbers, the patterns, and the people behind them.</p>
        </div>
        <Link to="/employees" className="inline-link">Explore people <VisualIcon name="arrow-up-right" size={18}/></Link>
      </section>

      {error && <div className="alert-banner" role="alert">{error}</div>}

      <section className="hero-grid" aria-label="Workforce summary">
        <div className="hero-card">
          <div className="hero-card-decoration" aria-hidden="true"><span/><span/><span/></div>
          <div className="hero-top"><span className="hero-label">01 / YOUR WORKFORCE</span><VisualIcon name="arrow-up-right" size={23}/></div>
          <div className="hero-main"><span className="hero-number">{number(total)}</span><div className="hero-number-caption"><span>PEOPLE</span><span>IN YOUR TEAM</span></div></div>
          <div className="hero-bottom"><span className="hero-dot"/> <span>{ready ? `${departments.length} active departments represented` : 'Connected to your local MySQL database'}</span></div>
        </div>
        <div className="hero-side">
          <div className="mini-metric"><div className="mini-metric-top"><span>AVAILABLE TODAY</span><span className="metric-bullet bullet-green"/></div><div className="mini-metric-number">{number(present)} <span>people</span></div><div className="mini-metric-foot">Currently marked present <VisualIcon name="arrow-up-right" size={17}/></div></div>
          <div className="mini-metric mini-metric-warm"><div className="mini-metric-top"><span>OUT OF OFFICE</span><span className="metric-bullet bullet-orange"/></div><div className="mini-metric-number">{number(away + leave)} <span>people</span></div><div className="mini-metric-foot">{number(away)} absent · {number(leave)} on leave <VisualIcon name="arrow-up-right" size={17}/></div></div>
        </div>
      </section>

      <div className="section-heading"><div><span className="section-number">02</span><h2>The shape of your team</h2></div><span className="section-annotation">ORGANIZATION / DISTRIBUTION</span></div>
      <section className="insights-grid">
        <div className="insight-panel panel-departments">
          <div className="panel-header"><div><span className="panel-overline">LIVE DATA <span className="live-indicator"/></span><h3>Where everyone works</h3><p>People across departments</p></div><span className="panel-corner">01 — 02</span></div>
          {ready && departments.length ? <SimpleBarChart data={departments}/> : <div className="chart-placeholder">{loading ? 'Loading department distribution…' : 'No department data available'}</div>}
          <div className="panel-footer"><span>{ready ? `${departments.length} departments` : 'Department summary'}</span><span>HEADCOUNT BY GROUP</span></div>
        </div>
        <div className="insight-panel panel-payroll">
          <div className="panel-header"><div><span className="panel-overline panel-overline-muted">ILLUSTRATIVE DATA</span><h3>Payroll trajectory</h3><p>Monthly expenditure trend</p></div><span className="panel-corner">02 — 02</span></div>
          <SimpleLineChart data={payrollCostOverTime} xDataKey="name" yDataKey="payrollCost" />
          <div className="panel-footer"><span>Sample historical series</span><span>NOT LIVE PAYROLL DATA</span></div>
        </div>
      </section>

      <div className="section-heading section-heading-lower"><div><span className="section-number">03</span><h2>The people behind the data</h2></div><Link to="/employees" className="text-link">View directory <VisualIcon name="arrow-right" size={17}/></Link></div>
      <section className="directory-panel">
        <div className="directory-header"><span>TEAM DIRECTORY</span><span>{ready ? `${total} TOTAL RECORDS` : 'LIVE DATABASE'}</span></div>
        {ready && employees.length ? <div className="employee-preview-list">{employees.slice(0, 5).map((employee, index) => <div className="preview-row" key={employee.id}><span className="preview-index">{String(index + 1).padStart(2, '0')}</span><span className="person-avatar">{initials(employee.name)}</span><div className="preview-person"><strong>{employee.name}</strong><small>{employee.email}</small></div><span className="preview-department">{employee.department}</span><span className={`status-pill status-${employee.status}`}><span/>{employee.status === 'present' ? 'Present' : employee.status === 'absent' ? 'Absent' : 'On leave'}</span></div>)}</div> : <div className="directory-empty">{loading ? 'Loading your team…' : 'No employees to display.'}</div>}
        <Link to="/employees" className="directory-footer">Open the full people directory <VisualIcon name="arrow-up-right" size={18}/></Link>
      </section>
    </div>
  )
}
