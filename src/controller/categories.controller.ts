import type { Request, Response } from "express";

import * as Schema from "@/schema/categories.schema.js";
import * as Service from "@/service/categories.service.js";
import * as ApiError from "@/util/apiError.js";

export async function createCategory(req: Request<{}, {}, Schema.CreateRequest>, res: Response) {
  const { name, description } = req.body;

  try {
    const result = await Service.create(name, description);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Category created successfully",
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

export async function getAllCategory(req: Request, res: Response) {
  try {
    const result = await Service.getALl();

    res.status(200).json({
      status_code: res.statusCode,
      message: "Categories retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status_code: res.statusCode,
      message: "Internal server error",
    });
  }
}

export async function getCategoryByName(req: Request<{ name: string }, {}>, res: Response) {
  const { name } = req.params;

  try {
    const result = await Service.getByName(name);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Category retrieved successfully",
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

export async function updateCategoryById(req: Request<{ id: string }, {}, Schema.UpdateRequest>, res: Response) {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    await Service.updateById(id, name, description);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Category updated successfully",
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

export async function deleteCategoryById(req: Request<{ id: string }, {}>, res: Response) {
  const { id } = req.params;

  try {
    await Service.deleteById(id);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Category deleted successfully",
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
