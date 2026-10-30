/**
 * @vitest-environment jsdom
 */
import { afterEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createEmployee, getDepartments } from "../services/api";
import EmployeeForm from "../components/EmployeeForm";

vi.mock("../services/api", () => ({
  getDepartments: vi.fn(),
  createEmployee: vi.fn(),
  updateEmployee: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it("loads and displays available departments", async () => {
  vi.mocked(getDepartments).mockResolvedValue([
    { id: 1, name: "Technology" },
    { id: 2, name: "Sales" },
  ]);

  render(<EmployeeForm onSuccess={vi.fn()} />);

  const departmentSelect = screen.getByLabelText("Department");

  expect((departmentSelect as HTMLSelectElement).disabled).toBe(true);

  expect(
    await screen.findByRole("option", { name: "Technology" }),
  ).toBeTruthy();
  expect(screen.getByRole("option", { name: "Sales" })).toBeTruthy();

  expect(getDepartments).toHaveBeenCalledOnce();
  expect((departmentSelect as HTMLSelectElement).disabled).toBe(false);
});

it("displays an error when departments fail to load", async () => {
  vi.mocked(getDepartments).mockRejectedValue(new Error("Network error"));

  render(<EmployeeForm onSuccess={vi.fn()} />);

  const error = await screen.findByRole("alert");

  expect(error.textContent).toBe(
    "Could not load departments. Check the API connection.",
  );

  const submitButton = screen.getByRole("button", {
    name: "Add person",
  });

  expect((submitButton as HTMLButtonElement).disabled).toBe(true);

  expect(getDepartments).toHaveBeenCalledOnce();
});

it("creates an employee with the submitted form data", async () => {
  vi.mocked(getDepartments).mockResolvedValue([{ id: 1, name: "Technology" }]);

  const createdEmployee = {
    id: 1,
    name: "Alex Morgan",
    email: "alex@example.com",
    department: "Technology",
    role: "Frontend Developer",
    status: "present" as const,
  };

  vi.mocked(createEmployee).mockResolvedValue(createdEmployee);

  const onSuccess = vi.fn();

  render(<EmployeeForm onSuccess={onSuccess} />);

  await screen.findByRole("option", { name: "Technology" });

  fireEvent.change(screen.getByLabelText("Full name"), {
    target: { value: "Alex Morgan" },
  });

  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "alex@example.com" },
  });

  fireEvent.change(screen.getByLabelText("Department"), {
    target: { value: "Technology" },
  });

  fireEvent.change(screen.getByLabelText("Role / position"), {
    target: { value: "Frontend Developer" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Add person" }));

  await waitFor(() => {
    expect(createEmployee).toHaveBeenCalledWith({
      name: "Alex Morgan",
      email: "alex@example.com",
      department: "Technology",
      role: "Frontend Developer",
      status: "present",
    });
  });

  expect(onSuccess).toHaveBeenCalledWith(createdEmployee);
});
