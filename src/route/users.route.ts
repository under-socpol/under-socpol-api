import express from "express";

import * as ValidateMiddleware from "@/middleware/validate.middleware.js";
import * as CheckRoleMiddleware from "@/middleware/chechkRole.middleware.js";
import * as Schema from "@/schema/users.schema.js";
import * as Controller from "@/controller/users.controller.js";

const router = express.Router();

router.post(
  "/users",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.CreateSchema, "body"),
  Controller.createUser
);
router.get(
  "/users",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.TakeQuerySchema, "query"),
  Controller.getAllUser
);
router.get("/users/me", ValidateMiddleware.validateToken, Controller.getCurrentUser);
router.put("/users/name", ValidateMiddleware.validateToken, ValidateMiddleware.validateRequest(Schema.UpdateNameSchema, "body"), Controller.updateUserNameById);
router.put(
  "/users/email",
  ValidateMiddleware.validateToken,
  ValidateMiddleware.validateRequest(Schema.UpdateEmailSchema, "body"),
  Controller.newEmailVerificationById
);
router.get("/users/new_email_verification", ValidateMiddleware.validateRequest(Schema.KeyQuerySchema, "query"), Controller.updateUserEmailById);
router.put(
  "/users/password",
  ValidateMiddleware.validateToken,
  ValidateMiddleware.validateRequest(Schema.UpdatePasswordSchema, "body"),
  Controller.updateUserPasswordById
);
router.patch(
  "/users/:id",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.IdParamsSchema, "params"),
  ValidateMiddleware.validateRequest(Schema.UpdateSchema, "body"),
  Controller.updateUserById
);
router.delete(
  "/users/:id",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.IdParamsSchema, "params"),
  Controller.deleteUserById
);

export default router;
