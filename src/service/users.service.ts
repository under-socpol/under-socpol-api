import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import * as Repository from "@/repository/users.repository.js";
import * as ApiError from "@/util/apiError.js";
import * as SendEmail from "@/util/sendEmail.js";

export async function create(name: string, email: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await Repository.create(name, email, hashedPassword, true);

    if (!result) {
      throw ApiError.createApiError("Server error: Failed to create user", 500);
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const result = await Repository.findByEmail(email);

      if (!result) {
        throw ApiError.createApiError("Server error: Invalid user email", 404);
      }

      if (result) {
        throw ApiError.createApiError("Email is already in use", 400);
      }
    }

    throw error;
  }
}

export async function getAll(id: string, take: number, page: number) {
  const skip = (page - 1) * take;
  const { users, total } = await Repository.findAll(id, take, skip);
  const sanitized = users.map(({ password, ...rest }) => rest);
  const totalPages = Math.ceil(total / take);

  return {
    users: sanitized,
    pagination: {
      page,
      take,
      total,
      totalPages,
    },
  };
}

export async function getById(id: string) {
  const result = await Repository.findById(id);

  if (!result) {
    throw ApiError.createApiError("User not found", 404);
  }

  const { password, ...user } = result;

  return user;
}

export async function updateNameById(id: string, name: string) {
  try {
    await Repository.updateNameById(id, name);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw ApiError.createApiError("Invalid user ID", 400);
    }

    throw error;
  }
}

export async function newEmailVerificationById(id: string, name: string, email: string) {
  const result = await Repository.findByEmail(email);

  if (result) {
    throw ApiError.createApiError("Email is already in use", 400);
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

  const key = jwt.sign({ id, email }, process.env.SECRET_EMAIL_VERIFICATION, {
    expiresIn: "5m",
  });

  await SendEmail.newEmailVerification(
    name,
    email,
    `${process.env.API_URL}/api/v1/users/new_email_verification?key=${key}`,
    `${process.env.CLIENT_URL}/admin/profile`
  );
}

export async function updateEmailById(key: string) {
  try {
    if (!process.env.SECRET_EMAIL_VERIFICATION) {
      throw ApiError.createApiError("Server error: Missing email verification secret", 500);
    }

    const { id, email } = jwt.verify(key, process.env.SECRET_EMAIL_VERIFICATION) as JwtPayload;

    await Repository.updateEmailById(id, email);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw ApiError.createApiError("Invalid user ID", 400);
    }

    throw ApiError.createApiError("Verification key is invalid or has expired", 400);
  }
}

export async function updatePasswordById(id: string, oldPassword: string, newPassword: string) {
  try {
    const result = await Repository.findById(id);

    if (!result) {
      throw ApiError.createApiError("Invalid user ID", 400);
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, result.password);

    if (!passwordsMatch) {
      throw ApiError.createApiError("Invalid old password", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Repository.updatePasswordById(id, hashedPassword);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw ApiError.createApiError("Invalid user ID", 400);
    }

    throw error;
  }
}

export async function updateById(id: string, updates: { name?: string; email?: string; password?: string }) {
  const { email, name, password } = updates;

  try {
    if (email !== undefined) {
      await Repository.updateById({ id, email });
    }

    const otherUpdates: { name?: string; password?: string } = {};

    if (name !== undefined) {
      otherUpdates.name = name;
    }

    if (password !== undefined) {
      otherUpdates.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(otherUpdates).length > 0) {
      await Repository.updateById({ id, ...otherUpdates });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw ApiError.createApiError("Email is already in use", 400);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw ApiError.createApiError("Invalid user ID", 400);
    }

    throw error;
  }
}

export async function deleteById(id: string) {
  try {
    await Repository.deleteById(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw ApiError.createApiError("Invalid user ID", 400);
    }

    throw error;
  }
}
