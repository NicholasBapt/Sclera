import { describe, expect, it } from "vitest";
import { countEmployees } from "../utils/employeeStats";

describe("Employee statistics", () => {
  it("counts employees correctly", () => {
    const employees = [{ id: 1 }, { id: 2 }, { id: 3 }];

    expect(countEmployees(employees)).toBe(3);
  });

  it("returns zero for an empty employee list", () => {
    expect(countEmployees([])).toBe(0);
  });
});
