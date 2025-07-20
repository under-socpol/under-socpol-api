import { Prisma } from "@prisma/client";

import * as ArticlesRepository from "@/repository/articles.repository.js";
import * as CategoriesRepository from "@/repository/categories.repository.js";
import * as ApiError from "@/util/apiError.js";

export async function create(title: string, excerpt: string, content: any, category_id: string, user_id: string) {
  try {
    await ArticlesRepository.create(title, excerpt, content, category_id, user_id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003" && error.meta && "constraint" in error.meta) {
      if (error.meta.constraint === "articles_user_id_fkey") {
        throw ApiError.createApiError("Invalid user ID", 400);
      }

      throw ApiError.createApiError("Invalid category ID", 400);
    }

    throw error;
  }
}

export async function getAll(take: number, page: number) {
  const skip = (page - 1) * take;
  const { articles, total } = await ArticlesRepository.findAll(take, skip);
  const totalPages = Math.ceil(total / take);

  return {
    articles,
    pagination: {
      page,
      take,
      total,
      totalPages,
    },
  };
}

export async function getById(id: string) {
  const result = await ArticlesRepository.findById(id);

  if (!result) {
    throw ApiError.createApiError("Invalid category ID", 400);
  }

  return result;
}

export async function getByCategoryId(category: string, take: number, page: number) {
  const articleCategory = await CategoriesRepository.findByName(category);

  if (!articleCategory) {
    throw ApiError.createApiError("Invalid category", 400);
  }

  const skip = (page - 1) * take;
  const { articles, total } = await ArticlesRepository.findByCategoryId(articleCategory.id, take, skip);
  const totalPages = Math.ceil(total / take);

  return {
    articles,
    pagination: {
      page,
      take,
      total,
      totalPages,
    },
  };
}

export async function getByUserId(user_id: string, take: number, page: number) {
  const skip = (page - 1) * take;
  const { articles, total } = await ArticlesRepository.findByUserId(user_id, take, skip);
  const totalPages = Math.ceil(total / take);

  return {
    articles,
    pagination: {
      page,
      take,
      total,
      totalPages,
    },
  };
}

export async function updateById(id: string, title: string, excerpt: string, content: any, category_id: string, user_id: string) {
  try {
    await ArticlesRepository.updateById(id, title, excerpt, content, category_id, user_id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003" && error.meta && "constraint" in error.meta) {
      if (error.meta.constraint === "articles_user_id_fkey") {
        throw ApiError.createApiError("Invalid user ID", 400);
      }

      throw ApiError.createApiError("Invalid category ID", 400);
    }

    throw error;
  }
}

export async function updateIsPublishedById(id: string, is_published: boolean) {
  await ArticlesRepository.updateIsPublishedById(id, is_published);
}

export async function deleteById(id: string) {
  try {
    await ArticlesRepository.deleteById(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw ApiError.createApiError("Invalid article ID", 400);
    }

    throw error;
  }
}
