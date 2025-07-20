import z from "zod";

export const IdParamsSchema = z.object({
  id: z.string({ required_error: "'id' params is required" }).uuid({ message: "ID must be a valid UUID" }),
});

export const UserIdParamsSchema = z.object({
  user_id: z.string({ required_error: "'user_id' params is required" }).uuid({ message: "User ID must be a valid UUID" }),
});

export const CreateSchema = z.object({
  title: z.string({ required_error: "'title' is required" }).min(1, "Title cannot be empty"),
  excerpt: z.string({ required_error: "'excerpt' is required" }).min(1, "Excerpt cannot be empty"),
  content: z.object({}, { required_error: "'content' is required" }).passthrough(),
  category_id: z.string({ required_error: "'category_id' is required" }).uuid({ message: "Article ID must be a valid UUID" }),
});

export type CreateRequest = z.infer<typeof CreateSchema>;

export const GetAllSchema = z.object({
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

export const GetByCategorySchema = z.object({
  name: z.string({ required_error: "'name' query is required" }).min(1, "Category cannot be empty"),
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

export type GetByCategoryRequest = z.infer<typeof GetByCategorySchema>;

export const UpdateSchema = z.object({
  title: z.string({ required_error: "'title' is required" }).min(1, "Title cannot be empty"),
  excerpt: z.string({ required_error: "'excerpt' is required" }).min(1, "Excerpt cannot be empty"),
  content: z.object({}, { required_error: "'content' is required" }).passthrough(),
  category_id: z.string({ required_error: "'category_id' is required" }).uuid({ message: "Article ID must be a valid UUID" }),
});

export type UpdateRequest = z.infer<typeof UpdateSchema>;

export const UpdateIsPublishedSchema = z.object({
  is_published: z.boolean({ required_error: "'is_published' is required" }),
});

export type UpdateIsPublishedRequest = z.infer<typeof UpdateIsPublishedSchema>;
