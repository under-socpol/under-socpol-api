import z from "zod";

export const IdParamsSchema = z.object({
  id: z.string({ required_error: "'id' params is required" }).uuid({ message: "ID must be a valid UUID" }),
});

export const TakeQuerySchema = z.object({
  take: z
    .string({ required_error: "'take' query is required" })
    .min(1, "Take cannot be empty")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 20;
      },
      {
        message: "'take' must be a valid number between 1 and 20",
      }
    ),
  page: z
    .string({ required_error: "'page' query is required" })
    .min(1, "Page cannot be empty")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1;
      },
      {
        message: "'page' must be a valid number greater than or equal to 1",
      }
    ),
});

export const KeyQuerySchema = z.object({
  key: z
    .string({
      required_error: "'key' query is required",
    })
    .min(1, "Key cannot be empty"),
});

export const CreateSchema = z.object({
  name: z.string({ required_error: "'name' is required" }).min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string({ required_error: "'email' is required" }).email({ message: "Invalid email address" }),
  password: z.string({ required_error: "'password' is required" }).min(8, { message: "Password must be at least 8 characters long" }),
});

export type CreateRequest = z.infer<typeof CreateSchema>;

export const UpdateNameSchema = z.object({
  name: z
    .string({
      required_error: "'name' is required",
    })
    .min(3, { message: "Name must be at least 3 characters long" }),
});

export type UpdateNameRequest = z.infer<typeof UpdateNameSchema>;

export const UpdateEmailSchema = z.object({
  name: z
    .string({
      required_error: "'name' is required",
    })
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z
    .string({
      required_error: "'email' is required",
    })
    .email({ message: "Invalid email address" }),
});

export type UpdateEmailRequest = z.infer<typeof UpdateEmailSchema>;

export const UpdatePasswordSchema = z.object({
  oldPassword: z
    .string({
      required_error: "'oldPassword' is required",
    })
    .min(8, { message: "Old Password must be at least 8 characters long" }),
  newPassword: z
    .string({
      required_error: "'newPassword' is required",
    })
    .min(8, { message: "New Password must be at least 8 characters long" }),
});

export type UpdatePasswordRequest = z.infer<typeof UpdatePasswordSchema>;

export const UpdateSchema = z
  .object({
    name: z
      .string({
        required_error: "'name' is required",
      })
      .min(3, { message: "Name must be at least 3 characters long" })
      .optional(),

    email: z
      .string({
        required_error: "'email' is required",
      })
      .email({ message: "Invalid email address" })
      .optional(),

    password: z
      .string({
        required_error: "'password' is required",
      })
      .min(8, { message: "Password must be at least 8 characters long" })
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined || data.password !== undefined, {
    message: "At least one field (name, email, or password) must be provided",
  });

export type UpdateRequest = z.infer<typeof UpdateSchema>;
