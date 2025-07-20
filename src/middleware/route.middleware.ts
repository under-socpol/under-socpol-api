import type { Request, Response, NextFunction } from "express";

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    status_code: res.statusCode,
    message: "Not Found: This route does not exist.",
  });
}
