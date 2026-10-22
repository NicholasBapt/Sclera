import { useEffect, useMemo, useState } from 'react'
import Button from '../components/Button'
import EmployeeForm from '../components/EmployeeForm'
import DataTable from '../components/DataTableComponents/DataTable'
import VisualIcon from '../components/ui/VisualIcon'
import { deleteEmployee, getEmployees, type Employee } from '../services/api'

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()
}

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    getEmployees().then(setEmployees).catch(() => setError('Unable to load employees. Check that your API and MySQL are running.')).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!showForm && !employeeToDelete) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !deleting) {
        setShowForm(false)
        setEmployeeToDelete(null)
        setDeleteError(null)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showForm, employeeToDelete, deleting])

  const total = employees.length
  const present = employees.filter(e => e.status === 'present').length
  const away = employees.filter(e => e.status === 'absent' || e.status === 'leave').length
  const filtered = useMemo(() => employees.filter(employee => {
    const matchesSearch = [employee.name, employee.email, employee.department, employee.role].some(value => (value || '').toLowerCase().includes(search.toLowerCase().trim()))
    return matchesSearch && (status === 'all' || employee.status === status)
  }), [employees, search, status])

  function handleNewEmployee() {
    setSelectedEmployee(null)
    setShowForm(true)
  }

  function handleEditEmployee(employee: Employee) {
    setSelectedEmployee(employee)
    setShowForm(true)
  }

  function handleEmployeeSaved(employee: Employee) {
    setEmployees(previous => previous.some(item => item.id === employee.id) ? previous.map(item => item.id === employee.id ? employee : item) : [...previous, employee])
    setShowForm(false)
    setSelectedEmployee(null)
  }

  async function handleConfirmDelete() {
    if (!employeeToDelete || deleting) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteEmployee(employeeToDelete.id)
      setEmployees(previous => previous.filter(employee => employee.id !== employeeToDelete.id))
      setEmployeeToDelete(null)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Unable to delete employee')
    } finally {
      setDeleting(false)
    }
  }

  const columns = ['PERSON', 'DEPARTMENT', 'POSITION', 'STATUS', '']
  const rows = filtered.map(employee => [
    <div className="table-person" key={employee.id}><span className="person-avatar">{initials(employee.name)}</span><div><strong>{employee.name}</strong><small>{employee.email}</small></div></div>,
    <span className="department-label">{employee.department || 'Unassigned'}</span>,
    <span className="table-role">{employee.role}</span>,
    <span className={`status-pill status-${employee.status}`}><span/>{employee.status === 'present' ? 'Present' : employee.status === 'absent' ? 'Absent' : 'On leave'}</span>,
    <div className="row-actions"><button aria-label={`Edit ${employee.name}`} title={`Edit ${employee.name}`} onClick={() => handleEditEmployee(employee)}><VisualIcon name="edit" size={17}/></button><button className="row-action-danger" aria-label={`Delete ${employee.name}`} title={`Delete ${employee.name}`} onClick={() => { setDeleteError(null); setEmployeeToDelete(employee) }}><VisualIcon name="trash" size={17}/></button></div>,
  ])

  return (
    <div className="page-stack">
      <section className="page-heading people-heading">
        <div><div className="eyebrow"><span className="eyebrow-line"/> THE PEOPLE <span className="eyebrow-index">/ 02</span></div><h1>Your team, <em>in focus.</em></h1><p>One place for everyone who makes the work happen.</p></div>
        <Button onClick={handleNewEmployee} icon="plus">Add person</Button>
      </section>
      {error && <div className="alert-banner" role="alert">{error}</div>}
      <section className="people-summary" aria-label="Employee counts">
        <div className="people-stat"><span>TOTAL PEOPLE</span><div><strong>{loading ? '—' : total.toString().padStart(2, '0')}</strong><span className="stat-superscript">/ REGISTERED</span></div></div>
        <div className="people-stat"><span>AVAILABLE</span><div><strong>{loading ? '—' : present.toString().padStart(2, '0')}</strong><span className="stat-superscript">/ PRESENT</span></div></div>
        <div className="people-stat"><span>AWAY</span><div><strong>{loading ? '—' : away.toString().padStart(2, '0')}</strong><span className="stat-superscript">/ ABSENT + LEAVE</span></div></div>
        <div className="people-summary-art" aria-hidden="true"><span/><span/><span/></div>
      </section>
      <section className="roster-panel">
        <div className="roster-intro"><div><span className="panel-overline">PEOPLE / DIRECTORY</span><h2>Team directory</h2><p>Browse, manage and keep your records in order.</p></div><span className="roster-total">{filtered.length} RECORDS</span></div>
        <div className="roster-toolbar">
          <label className="search-field"><VisualIcon name="search" size={19}/><input aria-label="Search employees" type="search" value={search} placeholder="Search people, roles, departments…" onChange={event => setSearch(event.target.value)}/>{search && <button aria-label="Clear search" onClick={() => setSearch('')}><VisualIcon name="close" size={16}/></button>}</label>
          <label className="filter-select"><VisualIcon name="filter" size={17}/><select aria-label="Filter employee status" value={status} onChange={event => setStatus(event.target.value)}><option value="all">All statuses</option><option value="present">Present</option><option value="absent">Absent</option><option value="leave">On leave</option></select></label>
        </div>
        {loading ? <div className="directory-empty">Loading employees…</div> : <DataTable columns={columns} rows={rows} rowsPerPage={10} emptyLabel="No employees match your filters."/>}
      </section>

      {showForm && <div className="drawer-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setShowForm(false) }}><aside className="employee-drawer" role="dialog" aria-modal="true" aria-labelledby="employee-form-title"><div className="drawer-header"><div><span className="eyebrow eyebrow-inverse">PEOPLE / {selectedEmployee ? 'EDIT RECORD' : 'NEW RECORD'}</span><h2 id="employee-form-title">{selectedEmployee ? 'Edit this person.' : 'Add to the team.'}</h2><p>{selectedEmployee ? 'Update the employee record below.' : 'A few details to bring someone into the picture.'}</p></div><button className="drawer-close" aria-label="Close employee form" onClick={() => setShowForm(false)}><VisualIcon name="close"/></button></div><div className="drawer-body"><EmployeeForm key={selectedEmployee?.id ?? 'new'} employee={selectedEmployee} onSuccess={handleEmployeeSaved} onCancel={() => setShowForm(false)}/></div><div className="drawer-aside"><VisualIcon name="shield" size={17}/> Records are saved to your local MySQL database.</div></aside></div>}

      {employeeToDelete && <div className="modal-backdrop"><div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-employee-title" aria-describedby="delete-employee-description"><div className="confirm-icon"><VisualIcon name="trash" size={23}/></div><span className="panel-overline">PERMANENT ACTION</span><h2 id="delete-employee-title">Remove this person?</h2><p id="delete-employee-description">You're about to permanently delete <strong>{employeeToDelete.name}</strong> from your directory. This can't be undone.</p>{deleteError && <div className="alert-banner" role="alert">{deleteError}</div>}<div className="confirm-actions"><Button variant="secondary" onClick={() => { setEmployeeToDelete(null); setDeleteError(null) }} disabled={deleting}>Keep record</Button><Button variant="danger" onClick={handleConfirmDelete} disabled={deleting}>{deleting ? 'Removing…' : 'Delete person'}</Button></div></div></div>}
    </div>
  )
}
