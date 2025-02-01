import { Request, Response } from 'express';

export function getStatus(req: Request, res: Response) {
  res.json({ status: "OK", message: "Server is running!" });
}

export function doSomething(req: Request, res: Response) {
  const { command } = req.body;
  res.json({ message: `Executed command: ${command}` });
}