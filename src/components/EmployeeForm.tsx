import { useEffect, useState, type FormEvent } from 'react'
import Button from './Button'
import InputField from './FormComponents/Inputs/InputField'
import { createEmployee, updateEmployee, getDepartments, type CreateEmployeeData, type Employee, type Department } from '../services/api'

type EmployeeFormProps = {
  employee?: Employee | null
  onSuccess: (employee: Employee) => void
  onCancel?: () => void
}

const initialForm: CreateEmployeeData = { name: '', email: '', department: '', role: '', status: 'present' }

export default function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const [form, setForm] = useState<CreateEmployeeData>(employee ? { name: employee.name, email: employee.email, department: employee.department, role: employee.role, status: employee.status } : { ...initialForm })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [departmentError, setDepartmentError] = useState<string | null>(null)

  useEffect(() => {
    getDepartments().then(setDepartments).catch(() => setDepartmentError('Could not load departments. Check the API connection.')).finally(() => setLoadingDepartments(false))
  }, [])

  function updateField<K extends keyof CreateEmployeeData>(field: K, value: CreateEmployeeData[K]) {
    setForm(previous => ({ ...previous, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const result = employee ? await updateEmployee(employee.id, form) : await createEmployee(form)
      onSuccess(result)
      if (!employee) setForm({ ...initialForm })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving employee')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <div className="form-section-kicker"><span>01</span> PERSONAL DETAILS</div>
      <div className="form-grid">
        <InputField label="Full name" placeholder="e.g. Alex Morgan" value={form.name} onChange={event => updateField('name', event.target.value)} required maxLength={150} disabled={saving}/>
        <InputField label="Email address" placeholder="alex@company.com" type="email" value={form.email} onChange={event => updateField('email', event.target.value)} required maxLength={150} disabled={saving}/>
      </div>
      <div className="form-divider"/>
      <div className="form-section-kicker"><span>02</span> WORK DETAILS</div>
      <div className="form-grid">
        <label className="field-group" htmlFor="department-select"><span className="field-label">Department</span><select id="department-select" className="form-select" value={form.department} onChange={event => updateField('department', event.target.value)} disabled={saving || loadingDepartments || Boolean(departmentError)} required><option value="">{loadingDepartments ? 'Loading departments…' : 'Choose department'}</option>{departments.map(department => <option value={department.name} key={department.id}>{department.name}</option>)}</select></label>
        <InputField label="Role / position" placeholder="e.g. Product Designer" value={form.role} onChange={event => updateField('role', event.target.value)} required maxLength={100} disabled={saving}/>
        <label className="field-group" htmlFor="employee-status"><span className="field-label">Attendance status</span><select id="employee-status" className="form-select" value={form.status} onChange={event => updateField('status', event.target.value as CreateEmployeeData['status'])} disabled={saving}><option value="present">Present</option><option value="absent">Absent</option><option value="leave">On leave</option></select></label>
      </div>
      {departmentError && <div className="alert-banner" role="alert">{departmentError}</div>}
      {error && <div className="alert-banner" role="alert">{error}</div>}
      <div className="form-actions"><Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>Cancel</Button><Button type="submit" disabled={saving || loadingDepartments || Boolean(departmentError) || !departments.some(d => d.name === form.department)} icon="arrow-right">{saving ? 'Saving…' : employee ? 'Save changes' : 'Add person'}</Button></div>
    </form>
  )
}
