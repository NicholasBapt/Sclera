import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import departmentRoutes from "./routes/departmentRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.json({ status: "ok" });
});

app.use("/users", userRoutes);
app.use("/employees", employeeRoutes);
app.use("/departments", departmentRoutes);

export default app;
