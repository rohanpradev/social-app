import { z } from "zod";

export const signUpSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(1, "Username is required")
    .regex(/^[a-zA-z0-9_-]+$/, "Only letters, numbers , - and _ are allowed"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  password: z.string().trim().min(1, "Password is required").min(8, "Password must atleast be 8 characters"),
});

export type SignUpType = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  userName: z.string().trim().min(1, "Username is required"),
  password: z.string().trim().min(1, "Password is required"),
});

export type LoginType = z.infer<typeof loginSchema>;
