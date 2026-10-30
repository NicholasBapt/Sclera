export type Employee = {
  id: number;
};

export const countEmployees = (employees: Employee[]): number => {
  return employees.length;
};
