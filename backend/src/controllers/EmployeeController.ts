import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../database/connection";

interface DepartmentRow extends RowDataPacket {
  id: number;
}

async function findDepartmentId(name: string): Promise<number | null> {
  const [departments] = await pool.execute<DepartmentRow[]>(
    "SELECT id FROM departments WHERE name = ?",
    [name.trim()],
  );

  return departments[0]?.id ?? null;
}

interface Employee extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  department: string;
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
        role,
        status = "present",
      } = req.body ?? {};

      const fields = [name, email, department, role];

      if (fields.some((value) => typeof value !== "string" || !value.trim())) {
        return res.status(400).json({
          message: "Nome, e-mail, departamento e cargo são obrigatórios",
        });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          message: "E-mail inválido",
        });
      }

      if (!["present", "absent", "leave"].includes(status)) {
        return res.status(400).json({
          message: "Status inválido",
        });
      }

      const departmentId = await findDepartmentId(department);

      if (departmentId === null) {
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
          department.trim(),
          departmentId,
          role.trim(),
          status,
        ],
      );
      return res.status(201).json({
        id: result.insertId,
        name: name.trim(),
        email: email.trim(),
        department: department.trim(),
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
          message: "Já existe um funcionário com esse e-mail",
        });
      }

      console.error("Erro ao cadastrar funcionário:", error);

      return res.status(500).json({
        message: "Erro interno ao cadastrar funcionário",
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

      const { name, email, department, role, status } = req.body ?? {};

      const fields = [name, email, department, role];

      if (fields.some((value) => typeof value !== "string" || !value.trim())) {
        return res.status(400).json({
          message: "All employee fields are required",
        });
      }

      if (
        name.length > 150 ||
        email.length > 150 ||
        department.length > 100 ||
        role.length > 100
      ) {
        return res.status(400).json({
          message: "One or more fields exceed the maximum length",
        });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          message: "Invalid email address",
        });
      }

      if (!["present", "absent", "leave"].includes(status)) {
        return res.status(400).json({
          message: "Invalid employee status",
        });
      }

      const departmentId = await findDepartmentId(department);

      if (departmentId === null) {
        return res.status(400).json({
          message: "Department does not exist",
        });
      }

      const [result] = await pool.execute<ResultSetHeader>(
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
          department.trim(),
          departmentId,
          role.trim(),
          status,
          id,
        ],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }

      const [employees] = await pool.execute<Employee[]>(
        `SELECT id, name, email, department, role, status
       FROM employees
       WHERE id = ?`,
        [id],
      );

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
