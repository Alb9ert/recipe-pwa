import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, { message: "Please enter your email address" }).email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Please enter your name" })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(15, { message: "Name must be at most 15 characters" }),
    email: z.string().min(1, { message: "Please enter your email address" }).email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(1, { message: "Please enter a password" })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(30, { message: "Password must be less than 30 characters" })
      .regex(/(?=.*[0-9])(?=.*[a-zA-Z])/, {
        message: "Password must contain at least one letter and one number",
      }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
