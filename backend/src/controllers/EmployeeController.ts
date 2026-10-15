import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../database/connection";

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
        "SELECT id, name, email, department, role, status FROM employees",
      );

      return res.json(employees);
    } catch (error) {
      console.error("Erro ao consultar funcionários:", error);

      return res.status(500).json({
        message: "Erro interno ao consultar funcionários",
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

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO employees (name, email, department, role, status)
         VALUES (?, ?, ?, ?, ?)`,
        [name.trim(), email.trim(), department.trim(), role.trim(), status],
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
}
