import express from "express";

import * as Middleware from "@/middleware/validate.middleware.js";
import * as Schema from "@/schema/auth.schema.js";
import * as Controller from "@/controller/auth.controller.js";

const router = express.Router();

router.post("/auth/sign_up", Middleware.validateRequest(Schema.SignUpSchema, "body"), Controller.signUp);
router.get("/auth/email_verification", Middleware.validateRequest(Schema.EmailVerificationSchema, "query"), Controller.emailVerication);
router.post("/auth/sign_in", Middleware.validateRequest(Schema.SignInSchema, "body"), Controller.signIn);
router.post("/auth/forgot_password", Middleware.validateRequest(Schema.ForgotPasswordSchema, "body"), Controller.forgotPassword);
router.post("/auth/reset_password", Middleware.validateRequest(Schema.ResetPasswordSchema, "body"), Controller.resetPassword);

export default router;
