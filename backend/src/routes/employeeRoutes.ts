import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";

const employeeRoutes = Router();
const employeeController = new EmployeeController();

employeeRoutes.get("/", employeeController.list.bind(employeeController));
employeeRoutes.post("/", employeeController.create.bind(employeeController));

export default employeeRoutes;
