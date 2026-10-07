import { z } from "zod";

const email = z.string().trim().email("Enter a valid email address.");
const password = z.string().min(8, "Password must be at least 8 characters.").max(72, "Password must be 72 characters or fewer.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(1, "Enter your display name.").max(80, "Display name must be 80 characters or fewer."),
    email,
    password,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, "Enter your display name.").max(80, "Display name must be 80 characters or fewer."),
  avatarUrl: z.union([z.literal(""), z.string().trim().url("Enter a valid avatar URL.")]),
  preferredLanguage: z.enum(["ti", "en"]),
});

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Record<string, string[]>;
};

export const initialFormState: FormState = { status: "idle" };

export function validationError(error: z.ZodError): FormState {
  return {
    status: "error",
    message: "Please correct the highlighted fields.",
    errors: error.flatten().fieldErrors,
  };
}
