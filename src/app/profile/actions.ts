"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, validationError, type FormState } from "@/lib/auth/validation";

export async function updateProfile(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName"),
    avatarUrl: formData.get("avatarUrl"),
    preferredLanguage: formData.get("preferredLanguage"),
  });

  if (!parsed.success) return validationError(parsed.error);

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      avatar_url: parsed.data.avatarUrl || null,
      preferred_language: parsed.data.preferredLanguage,
    })
    .eq("id", user.id);

  if (error) return { status: "error", message: "Your profile could not be updated. Please try again." };

  revalidatePath("/profile");
  return { status: "success", message: "Profile updated." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
