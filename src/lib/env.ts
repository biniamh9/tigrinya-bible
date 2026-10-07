import { z } from "zod";

const supabaseProjectUrl = z
  .string()
  .url()
  // The dashboard may show REST endpoints ending in /rest/v1. Supabase's
  // client needs the project origin and appends its own service paths.
  .transform((value) => new URL(value).origin);

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: supabaseProjectUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export function getPublicEnvironment() {
  return publicEnvironmentSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}
