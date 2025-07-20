import express from "express";

import * as ValidateMiddleware from "@/middleware/validate.middleware.js";
import * as CheckRoleMiddleware from "@/middleware/chechkRole.middleware.js";
import * as Schema from "@/schema/categories.schema.js";
import * as Controller from "@/controller/categories.controller.js";

const router = express.Router();

router.post(
  "/categories",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["ADMIN", "SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.CreateSchema, "body"),
  Controller.createCategory
);
router.get("/categories", Controller.getAllCategory);
router.get("/categories/:name", ValidateMiddleware.validateRequest(Schema.NameParamsSchema, "params"), Controller.getCategoryByName);
router.put(
  "/categories/:id",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["ADMIN", "SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.IdParamsSchema, "params"),
  ValidateMiddleware.validateRequest(Schema.UpdateSchema, "body"),
  Controller.updateCategoryById
);
router.delete(
  "/categories/:id",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.IdParamsSchema, "params"),
  Controller.deleteCategoryById
);

export default router;
