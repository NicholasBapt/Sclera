export interface User {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

const API_URL = "http://localhost:3333";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error("Erro ao buscar usuários");
  }

  return response.json();
}

export type EmployeeStatus = "present" | "absent" | "leave";

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: EmployeeStatus;
}

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch("http://localhost:3333/employees");

  if (!response.ok) {
    throw new Error("Erro ao buscar funcionários");
  }

  return response.json();
}

export type CreateEmployeeData = Omit<Employee, "id">;

export async function createEmployee(
  data: CreateEmployeeData,
): Promise<Employee> {
  const response = await fetch("http://localhost:3333/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.message || "Erro ao cadastrar funcionário");
  }

  return response.json();
}

export async function updateEmployee(
  id: number,
  data: CreateEmployeeData,
): Promise<Employee> {
  const response = await fetch(`http://localhost:3333/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.message || "Error updating employee");
  }

  return response.json();
}

export async function deleteEmployee(id: number): Promise<void> {
  const response = await fetch(`http://localhost:3333/employees/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.message || "Error deleting employee");
  }
}

export async function getDepartments(): Promise<Department[]> {
  const response = await fetch("http://localhost:3333/departments");

  if (!response.ok) {
    throw new Error("Error fetching departments");
  }

  return response.json();
}
