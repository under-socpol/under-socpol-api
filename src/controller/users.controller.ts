import type { Request, Response } from "express";

import * as Schema from "@/schema/users.schema.js";
import * as Service from "@/service/users.service.js";
import * as ApiError from "@/util/apiError.js";

export async function createUser(req: Request<{}, {}, Schema.CreateRequest>, res: Response) {
  const { name, email, password } = req.body;

  try {
    await Service.create(name, email, password);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Users created successfully",
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

export async function getAllUser(req: Request, res: Response) {
  const { take, page } = req.query;
  const { id } = res.locals.tokenPayload as { id: string };

  try {
    const result = await Service.getAll(id, parseInt(take as string), parseInt(page as string));

    res.status(200).json({
      status_code: res.statusCode,
      message: "Users retrieved successfully",
      data: result.users,
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

export async function getCurrentUser(req: Request, res: Response) {
  const { id } = res.locals.tokenPayload as { id: string };

  try {
    const result = await Service.getById(id);

    res.status(200).json({
      status_code: res.statusCode,
      message: "User retrieved successfully",
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

export async function updateUserNameById(req: Request<{}, {}, Schema.UpdateNameRequest>, res: Response) {
  const { id } = res.locals.tokenPayload as { id: string };
  const { name } = req.body;

  try {
    await Service.updateNameById(id, name);

    res.status(200).json({
      status_code: res.statusCode,
      message: "User name updated successfully",
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

export async function newEmailVerificationById(req: Request<{}, {}, Schema.UpdateEmailRequest>, res: Response) {
  const { id } = res.locals.tokenPayload as { id: string };
  const { name, email } = req.body;

  try {
    await Service.newEmailVerificationById(id, name, email);

    res.status(200).json({
      status_code: res.statusCode,
      message: "Please check your new email to verify your new email",
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

export async function updateUserEmailById(req: Request, res: Response) {
  const { key } = req.query;

  try {
    await Service.updateEmailById(key as string);

    res.redirect(303, `${process.env.CLIENT_URL}/email_update?status_code=200&message=Your email has been updated successfully`);
  } catch (error) {
    if (ApiError.isApiError(error)) {
      res.redirect(303, `${process.env.CLIENT_URL}/email_update?status_code=400&message=${error.message}`);

      return;
    }

    res.status(500).json({
      status_code: res.statusCode,
      message: "Internal server error",
    });
  }
}

export async function updateUserPasswordById(req: Request<{}, {}, Schema.UpdatePasswordRequest>, res: Response) {
  const { id } = res.locals.tokenPayload as { id: string };
  const { oldPassword, newPassword } = req.body;

  try {
    await Service.updatePasswordById(id, oldPassword, newPassword);

    res.status(200).json({
      status_code: res.statusCode,
      message: "User password updated successfully",
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

export async function updateUserById(req: Request<{ id: string }, {}, Schema.UpdateRequest>, res: Response) {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updated = await Service.updateById(id, { name, email, password });

    res.status(200).json({
      status_code: 200,
      message: "User updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      status_code: 400,
      message: error instanceof Error ? error.message : "Update failed",
    });
  }
}

export async function deleteUserById(req: Request<{ id: string }, {}>, res: Response) {
  const { id } = req.params;

  try {
    await Service.deleteById(id);

    res.status(200).json({
      status_code: res.statusCode,
      message: "User deleted successfully",
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
