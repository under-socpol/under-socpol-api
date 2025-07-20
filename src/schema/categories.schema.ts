import z from "zod";

export const IdParamsSchema = z.object({
  id: z.string({ required_error: "'id' params is required" }).uuid({ message: "ID must be a valid UUID" }),
});

export const NameParamsSchema = z.object({
  name: z.string({ required_error: "'name' params is required" }).min(1, "Name cannot be empty"),
});

export const CreateSchema = z.object({
  name: z.string({ required_error: "'name' is required" }).min(1, "Name cannot be empty"),
  description: z.string({ required_error: "'description' is required" }).min(1, "Description cannot be empty"),
});

export type CreateRequest = z.infer<typeof CreateSchema>;

export const UpdateSchema = z.object({
  name: z.string({ required_error: "'name' is required" }).min(1, "Name cannot be empty"),
  description: z.string({ required_error: "'description' is required" }).min(1, "Description cannot be empty"),
});

export type UpdateRequest = z.infer<typeof UpdateSchema>;
