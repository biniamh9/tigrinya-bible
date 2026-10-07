"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, validationError, type FormState } from "@/lib/auth/validation";

function safeAuthMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (normalized.includes("user already registered")) return "An account with this email already exists.";
  if (normalized.includes("email rate limit")) return "Too many email attempts. Please wait and try again.";
  if (normalized.includes("password")) return message;
  return "Authentication could not be completed. Please try again.";
}

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return validationError(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) return { status: "error", message: safeAuthMessage(error.message) };
  redirect("/profile");
}

export async function register(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) return validationError(parsed.error);

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
      emailRedirectTo: `${origin}/auth/callback?next=/profile`,
    },
  });

  if (error) return { status: "error", message: safeAuthMessage(error.message) };
  if (data.session) redirect("/profile");

  return {
    status: "success",
    message: "Account created. Check your email to confirm your address, then sign in.",
  };
}
