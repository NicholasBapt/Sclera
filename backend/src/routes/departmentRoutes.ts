import { Router } from "express";
import { DepartmentController } from "../controllers/DepartmentController";

const departmentRoutes = Router();
const departmentController = new DepartmentController();

departmentRoutes.get("/", departmentController.list.bind(departmentController));

export default departmentRoutes;
