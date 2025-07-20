import type { Request, Response } from "express";

import * as Schema from "@/schema/articles.schema.js";
import * as Service from "@/service/articles.service.js";
import * as ApiError from "@/util/apiError.js";

export async function createArticle(req: Request<{}, {}, Schema.CreateRequest>, res: Response) {
  const { id } = res.locals.tokenPayload as { id: string };
  const { title, excerpt, content, category_id } = req.body;

  try {
    await Service.create(title, excerpt, content, category_id, id);

    res.status(201).json({
      status_code: res.statusCode,
      message: "Article created successfully",
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

export async function getArticleById(req: Request<{ id: string }, {}>, res: Response) {
  const { id } = req.params;

  try {
    const result = await Service.getById(id);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Articles retrieved successfully",
      data: result,
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

export async function getAllArticle(req: Request, res: Response) {
  const { take, page } = req.query;

  try {
    const result = await Service.getAll(parseInt(take as string), parseInt(page as string));

    res.status(200).json({
      status_code: res.statusCode,
      message: "Articles retrieved successfully",
      data: result.articles,
      pagination: result.pagination,
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

export async function getArticlesByCategoryId(req: Request, res: Response) {
  const { name, take, page } = req.query;

  try {
    const result = await Service.getByCategoryId(name as string, parseInt(take as string), parseInt(page as string));

    res.status(200).json({
      status_code: res.statusCode,
      message: "Articles retrieved successfully",
      data: result.articles,
      pagination: result.pagination,
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

export async function getArticlesByUserId(req: Request<{ user_id: string }, {}>, res: Response) {
  const { user_id } = req.params;
  const { take, page } = req.query;

  try {
    const result = await Service.getByUserId(user_id, parseInt(take as string), parseInt(page as string));

    res.status(200).json({
      status_code: res.statusCode,
      message: "Articles retrieved successfully",
      data: result.articles,
      pagination: result.pagination,
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

export async function updateArticleById(req: Request<{ id: string }, {}, Schema.UpdateRequest>, res: Response) {
  const { id } = req.params;
  const { title, excerpt, content, category_id } = req.body;
  const { user_id } = res.locals.tokenPayload;

  try {
    await Service.updateById(id, title, excerpt, content, category_id, user_id);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Article updated successfully",
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

export async function updateArticleIsPublishedById(req: Request<{ id: string }, {}, Schema.UpdateIsPublishedRequest>, res: Response) {
  const { id } = req.params;
  const { is_published } = req.body;

  try {
    await Service.updateIsPublishedById(id, is_published);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Article is published updated successfully",
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

export async function deleteArticleById(req: Request<{ id: string }, {}>, res: Response) {
  const { id } = req.params;

  try {
    await Service.deleteById(id);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Article deleted successfully",
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
