import type { Request, Response, NextFunction } from "express";

import * as Repository from "@/repository/users.repository.js";

export function checkRole(requiredRoles: ("USER" | "ADMIN" | "SUPER_ADMIN")[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = res.locals.tokenPayload as { id: string };

    const result = await Repository.findById(id);

    if (!result || !result.role) {
      res.status(403).json({
        status_code: 403,
        message: "Access denied. Role not found in token.",
      });

      return;
    }

    if (!requiredRoles.includes(result.role as any)) {
      res.status(403).json({
        status_code: 403,
        message: "Access denied. You do not have the required role.",
      });

      return;
    }

    next();
  };
}
