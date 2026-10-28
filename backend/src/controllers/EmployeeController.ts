import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../database/connection";

interface DepartmentRow extends RowDataPacket {
  id: number;
  name: string;
}

interface Employee extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  department: string;
  departmentId: number | null;
  role: string;
  status: "present" | "absent" | "leave";
}

export class EmployeeController {
  async list(_req: Request, res: Response) {
    try {
      const [employees] = await pool.query<Employee[]>(
        `SELECT
        e.id,
        e.name,
        e.email,
        e.department_id AS departmentId,
        d.name AS department,
        e.role,
        e.status
      FROM employees e
      LEFT JOIN departments d
        ON e.department_id = d.id
      ORDER BY e.id`,
      );
      return res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);

      return res.status(500).json({
        message: "Internal error fetching employees",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const {
        name,
        email,
        department,
        departmentId,
        role,
        status = "present",
      } = req.body ?? {};

      const fields = [name, email, role];

      if (fields.some((value) => typeof value !== "string" || !value.trim())) {
        return res.status(400).json({
          message: "Name, email and role are required",
        });
      }

      if (
        name.trim().length > 150 ||
        email.trim().length > 150 ||
        role.trim().length > 100
      ) {
        return res.status(400).json({
          message: "One or more fields exceed the maximum length",
        });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({
          message: "Invalid email address",
        });
      }

      if (!["present", "absent", "leave"].includes(status)) {
        return res.status(400).json({
          message: "Invalid employee status",
        });
      }

      const usingId = departmentId !== undefined;

      if (
        usingId &&
        (!Number.isSafeInteger(departmentId) || departmentId <= 0)
      ) {
        return res.status(400).json({
          message: "Invalid department ID",
        });
      }

      if (
        !usingId &&
        (typeof department !== "string" ||
          !department.trim() ||
          department.trim().length > 100)
      ) {
        return res.status(400).json({
          message: "Invalid department",
        });
      }

      const [departments] = await pool.execute<DepartmentRow[]>(
        usingId
          ? "SELECT id, name FROM departments WHERE id = ?"
          : "SELECT id, name FROM departments WHERE name = ?",
        [usingId ? departmentId : department.trim()],
      );

      const selectedDepartment = departments[0];

      if (!selectedDepartment) {
        return res.status(400).json({
          message: "Department does not exist",
        });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO employees
        (name, email, department, department_id, role, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
        [
          name.trim(),
          email.trim(),
          selectedDepartment.name,
          selectedDepartment.id,
          role.trim(),
          status,
        ],
      );

      return res.status(201).json({
        id: result.insertId,
        name: name.trim(),
        email: email.trim(),
        department: selectedDepartment.name,
        departmentId: selectedDepartment.id,
        role: role.trim(),
        status,
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ER_DUP_ENTRY"
      ) {
        return res.status(409).json({
          message: "An employee with this email already exists",
        });
      }

      console.error("Error creating employee:", error);

      return res.status(500).json({
        message: "Internal error creating employee",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "Invalid employee ID",
        });
      }

      const { name, email, department, departmentId, role, status } =
        req.body ?? {};

      const fields = [name, email, role];

      if (fields.some((value) => typeof value !== "string" || !value.trim())) {
        return res.status(400).json({
          message: "Name, email and role are required",
        });
      }

      if (
        name.trim().length > 150 ||
        email.trim().length > 150 ||
        role.trim().length > 100
      ) {
        return res.status(400).json({
          message: "One or more fields exceed the maximum length",
        });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({
          message: "Invalid email address",
        });
      }

      if (!["present", "absent", "leave"].includes(status)) {
        return res.status(400).json({
          message: "Invalid employee status",
        });
      }

      const usingId = departmentId !== undefined;

      if (
        usingId &&
        (!Number.isSafeInteger(departmentId) || departmentId <= 0)
      ) {
        return res.status(400).json({
          message: "Invalid department ID",
        });
      }

      if (
        !usingId &&
        (typeof department !== "string" ||
          !department.trim() ||
          department.trim().length > 100)
      ) {
        return res.status(400).json({
          message: "Invalid department",
        });
      }

      const [departments] = await pool.execute<DepartmentRow[]>(
        usingId
          ? "SELECT id, name FROM departments WHERE id = ?"
          : "SELECT id, name FROM departments WHERE name = ?",
        [usingId ? departmentId : department.trim()],
      );

      const selectedDepartment = departments[0];

      if (!selectedDepartment) {
        return res.status(400).json({
          message: "Department does not exist",
        });
      }

      await pool.execute(
        `UPDATE employees
       SET name = ?,
           email = ?,
           department = ?,
           department_id = ?,
           role = ?,
           status = ?
       WHERE id = ?`,
        [
          name.trim(),
          email.trim(),
          selectedDepartment.name,
          selectedDepartment.id,
          role.trim(),
          status,
          id,
        ],
      );

      const [employees] = await pool.execute<Employee[]>(
        `SELECT
         e.id,
         e.name,
         e.email,
         e.department_id AS departmentId,
         d.name AS department,
         e.role,
         e.status
       FROM employees e
       LEFT JOIN departments d
         ON e.department_id = d.id
       WHERE e.id = ?`,
        [id],
      );

      if (employees.length === 0) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }

      return res.json(employees[0]);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ER_DUP_ENTRY"
      ) {
        return res.status(409).json({
          message: "An employee with this email already exists",
        });
      }

      console.error("Error updating employee:", error);

      return res.status(500).json({
        message: "Internal error updating employee",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "Invalid employee ID",
        });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "DELETE FROM employees WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting employee:", error);

      return res.status(500).json({
        message: "Internal error deleting employee",
      });
    }
  }
}
