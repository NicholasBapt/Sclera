import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../database/connection";

interface Department extends RowDataPacket {
  id: number;
  name: string;
}

export class DepartmentController {
  async list(_req: Request, res: Response) {
    try {
      const [departments] = await pool.execute<Department[]>(
        "SELECT id, name FROM departments ORDER BY name ASC",
      );

      return res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);

      return res.status(500).json({
        message: "Internal error fetching departments",
      });
    }
  }
}
