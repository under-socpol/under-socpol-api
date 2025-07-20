import type { Request, Response } from "express";

import * as Schema from "@/schema/auth.schema.js";
import * as Service from "@/service/auth.service.js";
import * as ApiError from "@/util/apiError.js";

export async function signUp(req: Request<{}, {}, Schema.SignUpRequest>, res: Response) {
  const { name, email, password } = req.body;

  try {
    await Service.signUp(name, email, password);

    res.status(201).json({
      status_code: res.statusCode,
      message: "User registered successfully. Please check your email to verify your account",
    });
  } catch (error) {
    if (ApiError.isApiError(error)) {
      res.status(error.statusCode).json({
        status_code: error.statusCode,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      status_code: res.statusCode,
      message: "Internal server error",
    });
  }
}

export async function emailVerication(req: Request, res: Response) {
  const { key } = req.query;

  try {
    await Service.emailVerication(key as string);

    res.redirect(303, `${process.env.CLIENT_URL}/auth/sign_in`);
  } catch (error) {
    if (ApiError.isApiError(error)) {
      res.redirect(303, `${process.env.CLIENT_URL}/link_expired`);

      return;
    }

    res.status(500).json({
      status_code: res.statusCode,
      message: "Internal server error",
    });
  }
}

export async function signIn(req: Request<{}, {}, Schema.SignUpRequest>, res: Response) {
  const { email, password } = req.body;

  try {
    const result = await Service.signIn(email, password);
    const { token } = result.token;

    res.status(200).json({
      status_code: res.statusCode,
      message: "User signed in successfully",
      data: {
        user: {
          id: result.user.id,
        },
        token,
      },
    });
  } catch (error) {
    if (ApiError.isApiError(error)) {
      res.status(error.statusCode).json({
        status_code: error.statusCode,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      status_code: res.statusCode,
      message: "Internal server error",
    });
  }
}

export async function forgotPassword(req: Request<{}, {}, Schema.ForgotPasswordRequest>, res: Response) {
  const { email } = req.body;

  try {
    await Service.forgotPassword(email);

    res.status(200).json({
      status_code: res.statusCode,
      message: "We've sent a password reset link to your email address",
    });
  } catch (error) {
    if (ApiError.isApiError(error)) {
      res.status(error.statusCode).json({
        status_code: error.statusCode,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      status_code: res.statusCode,
      message: "Internal server error",
    });
  }
}

export async function resetPassword(req: Request<{}, {}, Schema.ResetPasswordRequest>, res: Response) {
  const { key, password } = req.body;

  try {
    await Service.resetPassword(key, password);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Your password has been successfully reset. Please sign in with your new password",
    });
  } catch (error) {
    if (ApiError.isApiError(error)) {
      res.status(error.statusCode).json({
        status_code: error.statusCode,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      status_code: res.statusCode,
      message: "Internal server error",
    });
  }
}
