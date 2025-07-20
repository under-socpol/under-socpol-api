import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const validateRequest = (schema: ZodSchema, target: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const message = result.error.errors[0]?.message;

      res.status(400).json({
        status_code: 400,
        message,
      });

      return;
    }

    Object.assign(req[target], result.data);

    next();
  };
};

export async function validateToken(req: Request, res: Response, next: NextFunction) {
  const authorizationToken = req.headers.authorization;

  if (!authorizationToken) {
    res.status(401).json({
      status_code: 401,
      message: "Unauthorized. Token is required",
    });
    return;
  }

  if (!process.env.SECRET_JWT_TOKEN) {
    res.status(500).json({
      status_code: 500,
      message: "Server error: Missing JWT token secret",
    });
    return;
  }

  try {
    const token = authorizationToken.split(" ").at(1);

    if (!token) {
      res.status(403).json({
        status_code: 403,
        message: "Token is invalid or has expired",
      });

      return;
    }

    const decoded = jwt.verify(token, process.env.SECRET_JWT_TOKEN) as JwtPayload;
    res.locals.tokenPayload = decoded;

    next();
  } catch (error) {
    res.status(403).json({
      status_code: 403,
      message: "Token is invalid or has expired",
    });
  }
}
