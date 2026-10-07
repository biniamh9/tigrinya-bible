import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnvironment } from "@/lib/env";
import type { Database } from "@/types/database.generated";

export function createClient() {
  const env = getPublicEnvironment();
  return createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
