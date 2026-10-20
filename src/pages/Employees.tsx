import { useEffect, useState } from "react";
import CardComponent from "../components/cardComponent";
import DataTable from "../components/DataTableComponents/DataTable";
import CardsContainer from "../components/CardsContainer";
import Text from "../components/Text";
import Button from "../components/Button";
import EmployeeForm from "../components/EmployeeForm";
import { deleteEmployee, getEmployees, type Employee } from "../services/api";

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch {
        setError("Unable to load employees.");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  function handleNewEmployee() {
    setSelectedEmployee(null);
    setShowForm(true);
  }

  function handleEditEmployee(employee: Employee) {
    setSelectedEmployee(employee);
    setShowForm(true);
  }

  function handleCancel() {
    setSelectedEmployee(null);
    setShowForm(false);
  }

  function handleEmployeeSaved(employee: Employee) {
    setEmployees((previous) => {
      const exists = previous.some((item) => item.id === employee.id);

      if (exists) {
        return previous.map((item) =>
          item.id === employee.id ? employee : item,
        );
      }

      return [...previous, employee];
    });

    handleCancel();
  }

  function handleDeleteEmployee(employee: Employee) {
    setDeleteError(null);
    setEmployeeToDelete(employee);
  }

  function handleCancelDelete() {
    if (deleting) return;

    setEmployeeToDelete(null);
    setDeleteError(null);
  }

  async function handleConfirmDelete() {
    if (!employeeToDelete || deleting) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteEmployee(employeeToDelete.id);

      setEmployees((previous) =>
        previous.filter((employee) => employee.id !== employeeToDelete.id),
      );

      setEmployeeToDelete(null);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Unable to delete employee",
      );
    } finally {
      setDeleting(false);
    }
  }

  const totalEmployees = employees.length;
  const present = employees.filter(
    (employee) => employee.status === "present",
  ).length;
  const absent = employees.filter(
    (employee) => employee.status === "absent",
  ).length;
  const onLeave = employees.filter(
    (employee) => employee.status === "leave",
  ).length;

  const columns = ["Name", "Contact", "Department", "Role", "Actions"];

  const rows = employees.map((employee) => [
    employee.name,
    employee.email,
    employee.department,
    employee.role,
    <div key={employee.id} className="flex items-center gap-2">
      <Button size="xsm" onClick={() => handleEditEmployee(employee)}>
        Edit
      </Button>

      <Button size="xsm" border onClick={() => handleDeleteEmployee(employee)}>
        Delete
      </Button>
    </div>,
  ]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={showForm ? handleCancel : handleNewEmployee}>
          {showForm ? "Cancel" : "New employee"}
        </Button>
      </div>

      {showForm && (
        <CardComponent
          variant="tertiary"
          title={selectedEmployee ? "Edit employee" : "New employee"}
        >
          <EmployeeForm
            key={selectedEmployee?.id ?? "new"}
            employee={selectedEmployee}
            onSuccess={handleEmployeeSaved}
          />
        </CardComponent>
      )}

      <CardsContainer variant="secondary">
        <CardComponent variant="tertiary" title="All employees">
          <Text textColor="secondary" variant="heading-lg">
            {loading ? "..." : totalEmployees}
          </Text>
        </CardComponent>

        <CardComponent variant="tertiary" title="Present">
          <Text textColor="secondary" variant="heading-lg">
            {loading ? "..." : present}
          </Text>
        </CardComponent>

        <CardComponent variant="tertiary" title="Not in">
          <Text textColor="secondary" variant="heading-lg">
            {loading ? "..." : absent}
          </Text>
        </CardComponent>

        <CardComponent variant="tertiary" title="On a Leave">
          <Text textColor="secondary" variant="heading-lg">
            {loading ? "..." : onLeave}
          </Text>
        </CardComponent>
      </CardsContainer>

      <CardComponent title="Staff" variant="tertiary">
        {loading ? (
          <div className="p-4">
            <Text variant="body-md">Loading employees...</Text>
          </div>
        ) : error ? (
          <div className="p-4">
            <Text variant="body-md">{error}</Text>
          </div>
        ) : (
          <DataTable columns={columns} rows={rows} rowsPerPage={20} />
        )}
      </CardComponent>

      {employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-employee-title"
            aria-describedby="delete-employee-description"
            className="w-full max-w-md rounded-lg border border-blue-base bg-cloudy-base p-5 shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <Text as="h2" variant="heading-sm">
                Delete employee
              </Text>

              <Text as="p" variant="body-md">
                Are you sure you want to delete {employeeToDelete.name}?
              </Text>

              <Text as="p" variant="body-sm" textColor="secondary">
                This action cannot be undone.
              </Text>

              {deleteError && (
                <Text as="p" variant="body-sm">
                  {deleteError}
                </Text>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  size="sm"
                  border
                  disabled={deleting}
                  onClick={handleCancelDelete}
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  disabled={deleting}
                  onClick={handleConfirmDelete}
                >
                  {deleting ? "Deleting..." : "Confirm delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
