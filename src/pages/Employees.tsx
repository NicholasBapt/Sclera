import { useEffect, useState } from "react";
import CardComponent from "../components/cardComponent";
import DataTable from "../components/DataTableComponents/DataTable";
import CardsContainer from "../components/CardsContainer";
import Text from "../components/Text";
import { getEmployees, type Employee } from "../services/api";
import Button from "../components/Button";
import EmployeeForm from "../components/EmployeeForm";

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function handleEmployeeCreated(employee: Employee) {
    setEmployees((previous) => [...previous, employee]);
    setShowForm(false);
  }

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch {
        setError("Não foi possível carregar os funcionários.");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

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

  const columns = ["Name", "Contact", "Department", "Role"];

  const rows = employees.map((employee) => [
    employee.name,
    employee.email,
    employee.department,
    employee.role,
  ]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowForm((previous) => !previous)}>
          {showForm ? "Cancel" : "New employee"}
        </Button>
      </div>

      {showForm && (
        <CardComponent variant="tertiary" title="New employee">
          <EmployeeForm onSuccess={handleEmployeeCreated} />
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
    </div>
  );
}
