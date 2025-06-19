import { object, string, union, z } from "zod";


const base64Regex = /^data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+$/;

export const signUpSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),

  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),

  password: string({ required_error: "password is required" })
    .min(8, "password must be at least 8 characters")
    .max(32, "password cannot exceed 32 characters"),

  confirmPassword: string({ required_error: "confirmPassword is required" })
    .min(8, "confirmPassword must be at least 8 characters")
    .max(32, "confirmPassword cannot exceed 32 characters"),

  image: string()
    .regex(base64Regex, "Invalid Base64 image format")
    // .or(string().url("Invalid image URL"))
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),

  password: string({ required_error: "password is required" })
    .min(8, "password must be at least 8 characters")
    .max(32, "password cannot exceed 32 characters"),
});

export const forgotPasswordSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

export const resetPasswordSchema = object({
  password: string({ required_error: "password is required" })
    .min(8, "password must be at least 8 characters")
    .max(32, "password cannot exceed 32 characters"),

  confirmPassword: string({ required_error: "confirmPassword is required" })
    .min(8, "confirmPassword must be at least 8 characters")
    .max(32, "confirmPassword cannot exceed 32 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const videoUpdateSchema = object({
  title: string().min(1, "Title is required").max(255, "Title is too long"),
  description: string().optional(), // description is optional and can be nullable
  thumbnailUrl: string().url("Invalid URL").optional(),
  visibility: union([z.literal("private"), z.literal("public")]),
  categoryId: string().uuid("Invalid category ID").optional(),
  // Add slug
});

export const inputSchema = z.object({ id: z.string().uuid() });

export const videoIdSchema = z.string().uuid(); // If your videoId is a UUID

export const commentSchema = z.object({
  videoId: z.string().uuid({ message: "Invalid video ID" }),
  parentId: z.string().uuid().optional(),
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
});


