import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import * as Repository from "@/repository/users.repository.js";
import * as ApiError from "@/util/apiError.js";
import * as SendEmail from "@/util/sendEmail.js";

export async function signUp(name: string, email: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await Repository.create(name, email, hashedPassword);

    if (!result) {
      throw ApiError.createApiError("Server error: Failed to create user", 500);
    }

    if (!process.env.SECRET_EMAIL_VERIFICATION) {
      throw ApiError.createApiError("Server error: Missing email verification secret", 500);
    }

    if (!process.env.API_URL) {
      throw ApiError.createApiError("Server error: Missing api url", 500);
    }

    if (!process.env.CLIENT_URL) {
      throw ApiError.createApiError("Server error: Missing client url", 500);
    }

    const key = jwt.sign({ id: result.id }, process.env.SECRET_EMAIL_VERIFICATION, { expiresIn: "5m" });

    await SendEmail.emailVerification(
      result.name,
      result.email,
      `${process.env.API_URL}/api/v1/auth/email_verification?key=${key}`,
      `${process.env.CLIENT_URL}`
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const result = await Repository.findByEmail(email);

      if (!result) {
        throw ApiError.createApiError("Server error: Invalid user email", 404);
      }

      if (result.email_is_verified) {
        throw ApiError.createApiError("User already exists", 409);
      }

      if (!process.env.SECRET_EMAIL_VERIFICATION) {
        throw ApiError.createApiError("Server error: Missing email verification secret", 500);
      }

      if (!process.env.API_URL) {
        throw ApiError.createApiError("Server error: Missing api url", 500);
      }

      if (!process.env.CLIENT_URL) {
        throw ApiError.createApiError("Server error: Missing client url", 500);
      }

      const key = jwt.sign({ id: result.id }, process.env.SECRET_EMAIL_VERIFICATION, { expiresIn: "5m" });

      await SendEmail.emailVerification(
        result.name,
        result.email,
        `${process.env.API_URL}/api/v1/auth/email_verification?key=${key}`,
        `${process.env.CLIENT_URL}`
      );

      throw ApiError.createApiError("User already registered but not verified. Please check your email to verify your account", 409);
    }

    throw error;
  }
}

export async function emailVerication(key: string) {
  try {
    if (!process.env.SECRET_EMAIL_VERIFICATION) {
      throw ApiError.createApiError("Server error: Missing email verification secret", 500);
    }

    const { id } = jwt.verify(key, process.env.SECRET_EMAIL_VERIFICATION) as JwtPayload;

    await Repository.updateEmailIsVerifiedById(id);
  } catch (error) {
    throw ApiError.createApiError("Verification link is invalid or has expired", 400);
  }
}

export async function signIn(email: string, password: string) {
  const result = await Repository.findByEmail(email);

  if (!result) {
    throw ApiError.createApiError("Invalid email or password", 401);
  }

  const passwordsMatch = await bcrypt.compare(password, result.password);

  if (!passwordsMatch) {
    throw ApiError.createApiError("Invalid email or password", 401);
  }

  if (!result.email_is_verified) {
    if (!process.env.SECRET_EMAIL_VERIFICATION) {
      throw ApiError.createApiError("Server error: Missing email verification secret", 500);
    }

    if (!process.env.API_URL) {
      throw ApiError.createApiError("Server error: Missing api url", 500);
    }

    if (!process.env.CLIENT_URL) {
      throw ApiError.createApiError("Server error: Missing client url", 500);
    }

    const key = jwt.sign({ id: result.id }, process.env.SECRET_EMAIL_VERIFICATION, { expiresIn: "5m" });

    await SendEmail.emailVerification(
      result.name,
      result.email,
      `${process.env.API_URL}/api/v1/auth/email_verification?key=${key}`,
      `${process.env.CLIENT_URL}`
    );

    throw ApiError.createApiError("Your email address has not been verified. Please check your email to complete the verification process", 403);
  }

  if (!process.env.SECRET_JWT_TOKEN) {
    throw ApiError.createApiError("Server error: Missing JWT token secret", 500);
  }

  const token = jwt.sign({ id: result.id }, process.env.SECRET_JWT_TOKEN, { expiresIn: "2h" });

  return {
    user: result,
    token: {
      token,
      expires_in: 120 * 60,
    },
  };
}

export async function forgotPassword(email: string) {
  const result = await Repository.findByEmail(email);

  if (!result) {
    throw ApiError.createApiError("No user found with the provided email address", 404);
  }

  if (!process.env.SECRET_JWT_TOKEN) {
    throw ApiError.createApiError("Server error: Missing JWT token secret", 500);
  }

  if (!process.env.CLIENT_URL) {
    throw ApiError.createApiError("Server error: Missing client url", 500);
  }

  const key = jwt.sign({ id: result.id }, process.env.SECRET_JWT_TOKEN, { expiresIn: "5m" });

  await SendEmail.resetPassworVerification(result.name, result.email, `${process.env.CLIENT_URL}/auth/reset_password?key=${key}`, `${process.env.CLIENT_URL}`);
}

export async function resetPassword(key: string, password: string) {
  try {
    if (!process.env.SECRET_JWT_TOKEN) {
      throw ApiError.createApiError("Server error: Missing JWT token secret", 500);
    }

    const decoded = jwt.verify(key, process.env.SECRET_JWT_TOKEN) as JwtPayload;
    const hashedPassword = await bcrypt.hash(password, 10);

    await Repository.updatePasswordById(decoded.id, hashedPassword);
  } catch (error) {
    throw ApiError.createApiError("Reset link has expired or is invalid. Please request a new password reset", 400);
  }
}
