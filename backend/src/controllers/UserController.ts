import { Request, Response } from "express";

export class UserController {
  async list(req: Request, res: Response) {
    return res.json([
      {
        id: 1,
        name: "Nick",
      },
    ]);
  }
}
