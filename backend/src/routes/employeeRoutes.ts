import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";

const employeeRoutes = Router();
const employeeController = new EmployeeController();

employeeRoutes.get("/", employeeController.list.bind(employeeController));
employeeRoutes.post("/", employeeController.create.bind(employeeController));
employeeRoutes.put("/:id", employeeController.update.bind(employeeController));
employeeRoutes.delete(
  "/:id",
  employeeController.delete.bind(employeeController),
);

export default employeeRoutes;
