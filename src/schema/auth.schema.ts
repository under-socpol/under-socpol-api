import z from "zod";

export const SignUpSchema = z.object({
  name: z.string({ required_error: "'name' is required" }).min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string({ required_error: "'email' is required" }).email({ message: "Invalid email address" }),
  password: z.string({ required_error: "'password' is required" }).min(8, { message: "Password must be at least 8 characters long" }),
});

export type SignUpRequest = z.infer<typeof SignUpSchema>;

export const EmailVerificationSchema = z.object({
  key: z.string({ required_error: "'key' query is required" }).min(1, "Key cannot be empty"),
});

export type EmailVerificationRequest = z.infer<typeof EmailVerificationSchema>;

export const SignInSchema = z.object({
  email: z.string({ required_error: "'email' is required" }).email({ message: "Invalid email address" }),
  password: z.string({ required_error: "'password' is required" }).min(8, { message: "Password must be at least 8 characters long" }),
});

export type SignInRequest = z.infer<typeof SignInSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string({ required_error: "email is required" }).email({ message: "Invalid email address" }),
});

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  key: z.string({ required_error: "'key' is required" }).min(1, "Key cannot be empty"),
  password: z.string({ required_error: "'password' is required" }).min(8, { message: "Password must be at least 8 characters long" }),
});

export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;
