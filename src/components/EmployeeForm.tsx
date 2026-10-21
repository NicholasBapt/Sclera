import { useEffect, useState, type FormEvent } from "react";
import Button from "./Button";
import InputField from "./FormComponents/Inputs/InputField";
import Text from "./Text";
import {
  createEmployee,
  updateEmployee,
  getDepartments,
  type CreateEmployeeData,
  type Employee,
  type Department,
} from "../services/api";

interface EmployeeFormProps {
  employee?: Employee | null;
  onSuccess: (employee: Employee) => void;
}

const initialForm: CreateEmployeeData = {
  name: "",
  email: "",
  department: "",
  role: "",
  status: "present",
};

export default function EmployeeForm({
  employee,
  onSuccess,
}: EmployeeFormProps) {
  const [form, setForm] = useState<CreateEmployeeData>(
    employee
      ? {
          name: employee.name,
          email: employee.email,
          department: employee.department,
          role: employee.role,
          status: employee.status,
        }
      : { ...initialForm },
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [departmentError, setDepartmentError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch {
        setDepartmentError("Unable to load departments");
      } finally {
        setLoadingDepartments(false);
      }
    }

    fetchDepartments();
  }, []);

  const isEditing = Boolean(employee);

  function updateField<K extends keyof CreateEmployeeData>(
    field: K,
    value: CreateEmployeeData[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = employee
        ? await updateEmployee(employee.id, form)
        : await createEmployee(form);

      onSuccess(result);

      if (!employee) {
        setForm({ ...initialForm });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving employee");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Name"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          required
          maxLength={150}
          disabled={saving}
        />

        <InputField
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          required
          maxLength={150}
          disabled={saving}
        />

        <div className="flex flex-col gap-0.5">
          <Text variant="body-sm">Department</Text>

          <select
            value={form.department}
            onChange={(event) => updateField("department", event.target.value)}
            disabled={saving || loadingDepartments || Boolean(departmentError)}
            required
            className="w-full h-10 rounded-lg border border-blue-light bg-cloudy-base text-blue-light px-3 py-2 text-sm outline-none transition focus:bg-cloudy-light disabled:opacity-50"
          >
            <option value="">
              {loadingDepartments
                ? "Loading departments..."
                : "Select a department"}
            </option>

            {departments.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>

          {departmentError && <Text variant="body-sm">{departmentError}</Text>}
        </div>

        <InputField
          label="Role"
          value={form.role}
          onChange={(event) => updateField("role", event.target.value)}
          required
          maxLength={100}
          disabled={saving}
        />

        <div className="flex flex-col gap-0.5">
          <Text variant="body-sm">Status</Text>

          <select
            value={form.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as CreateEmployeeData["status"],
              )
            }
            disabled={saving}
            className="w-full h-10 rounded-lg border border-blue-light bg-cloudy-base text-blue-light px-3 py-2 text-sm outline-none transition focus:bg-cloudy-light"
          >
            <option value="present">Present</option>
            <option value="absent">Not in</option>
            <option value="leave">On a Leave</option>
          </select>
        </div>
      </div>

      {error && <Text variant="body-sm">{error}</Text>}

      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={
            saving ||
            loadingDepartments ||
            Boolean(departmentError) ||
            !departments.some(
              (department) => department.name === form.department,
            )
          }
        >
          {saving ? "Saving..." : isEditing ? "Save changes" : "Add employee"}
        </Button>
      </div>
    </form>
  );
}
