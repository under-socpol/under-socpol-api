import express from "express";

import * as ValidateMiddleware from "@/middleware/validate.middleware.js";
import * as CheckRoleMiddleware from "@/middleware/chechkRole.middleware.js";
import * as Schema from "@/schema/articles.schema.js";
import * as Controller from "@/controller/articles.controller.js";

const router = express.Router();

router.post(
  "/articles",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["USER", "ADMIN", "SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.CreateSchema, "body"),
  Controller.createArticle
);
router.get("/articles", ValidateMiddleware.validateRequest(Schema.GetAllSchema, "query"), Controller.getAllArticle);
router.get("/articles/categories", ValidateMiddleware.validateRequest(Schema.GetByCategorySchema, "query"), Controller.getArticlesByCategoryId);
router.get("/articles/id/:id", ValidateMiddleware.validateRequest(Schema.IdParamsSchema, "params"), Controller.getArticleById);
router.get(
  "/articles/users/:user_id",
  ValidateMiddleware.validateRequest(Schema.UserIdParamsSchema, "params"),
  ValidateMiddleware.validateRequest(Schema.GetAllSchema, "query"),
  Controller.getArticlesByUserId
);
router.put(
  "/articles/:id",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["USER", "ADMIN", "SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.IdParamsSchema, "params"),
  ValidateMiddleware.validateRequest(Schema.UpdateSchema, "body"),
  Controller.updateArticleById
);
router.put(
  "/articles/is_published/:id",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["USER", "ADMIN", "SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.IdParamsSchema, "params"),
  ValidateMiddleware.validateRequest(Schema.UpdateIsPublishedSchema, "body"),
  Controller.updateArticleIsPublishedById
);
router.delete(
  "/articles/:id",
  ValidateMiddleware.validateToken,
  CheckRoleMiddleware.checkRole(["USER", "ADMIN", "SUPER_ADMIN"]),
  ValidateMiddleware.validateRequest(Schema.IdParamsSchema, "params"),
  Controller.deleteArticleById
);

export default router;
