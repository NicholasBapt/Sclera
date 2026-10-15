import { useEffect, useState } from "react";
import CardComponent from "../components/cardComponent";
import DataTable from "../components/DataTableComponents/DataTable";
import SimpleBarChart from "../components/Charts/SimpleBarChart";
import CardsContainer from "../components/CardsContainer";
import Text from "../components/Text";
import SimpleLineChart from "../components/Charts/SimpleLineChart";
import payrollCostOverTime from "../data/payrollCostOverTime.json";
import { getEmployees, type Employee } from "../services/api";

export function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const employeesByDepartment = Object.entries(
    employees.reduce<Record<string, number>>((acc, employee) => {
      acc[employee.department] = (acc[employee.department] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const columns = ["Name", "Contact", "Department", "Role"];

  const rows = employees.map((employee) => [
    employee.name,
    employee.email,
    employee.department,
    employee.role,
  ]);

  return (
    <div className="flex flex-col gap-3">
      <CardsContainer variant="secondary">
        <CardComponent title="Monthly payroll cost">
          <Text variant="heading-lg">USD 13,000.00</Text>
        </CardComponent>

        <CardComponent variant="tertiary" title="Total employees">
          <Text textColor="secondary" variant="heading-lg">
            {loading ? "..." : error ? "—" : employees.length}
          </Text>
        </CardComponent>

        <CardComponent variant="tertiary" title="Turnover rate">
          <Text textColor="secondary" variant="heading-lg">
            12%
          </Text>
        </CardComponent>

        <CardComponent variant="tertiary" title="Active contracts">
          <Text textColor="secondary" variant="heading-lg">
            35
          </Text>
        </CardComponent>
      </CardsContainer>

      <CardsContainer variant="tertiary">
        <CardComponent title="Payroll cost over time" variant="tertiary">
          <SimpleLineChart
            data={payrollCostOverTime}
            xDataKey="name"
            yDataKey="payrollCost"
          />
        </CardComponent>

        <CardComponent title="Employees by Department" variant="tertiary">
          {loading ? (
            <Text variant="body-md">Loading chart...</Text>
          ) : error ? (
            <Text variant="body-md">{error}</Text>
          ) : (
            <SimpleBarChart data={employeesByDepartment} />
          )}
        </CardComponent>
      </CardsContainer>

      <CardComponent variant="tertiary" title="All Employees">
        {loading ? (
          <div className="p-4">
            <Text variant="body-md">Loading employees...</Text>
          </div>
        ) : error ? (
          <div className="p-4">
            <Text variant="body-md">{error}</Text>
          </div>
        ) : (
          <DataTable columns={columns} rows={rows} />
        )}
      </CardComponent>
    </div>
  );
}
