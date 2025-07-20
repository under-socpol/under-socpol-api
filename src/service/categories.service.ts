import { Prisma } from "@prisma/client";

import * as Repository from "@/repository/categories.repository.js";
import * as ApiError from "@/util/apiError.js";

export async function create(name: string, description: string) {
  try {
    await Repository.create(name, description);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw ApiError.createApiError("A category with this name already exists", 400);
    }

    throw error;
  }
}

export async function getALl() {
  const result = await Repository.findAll();

  return result;
}

export async function getByName(name: string) {
  const result = await Repository.findByName(name);

  if (!result) {
    throw ApiError.createApiError("Invalid category name", 400);
  }

  return result;
}

export async function updateById(id: string, name: string, description: string) {
  try {
    await Repository.updateById(id, name, description);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw ApiError.createApiError("Invalid category ID", 400);
    }

    throw error;
  }
}

export async function deleteById(id: string) {
  try {
    await Repository.deleteById(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw ApiError.createApiError("Invalid category ID", 400);
    }

    throw error;
  }
}
