import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { createClient } from "@/lib/supabase/server";
import { logout, updateProfile } from "./actions";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, preferred_language, role, created_at")
    .eq("id", user.id)
    .single();

  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Account</p>
          <h1 className="mt-3 text-3xl font-semibold">Your profile</h1>
          <p className="mt-2 break-all text-sm text-[var(--muted)]">{user.email}</p>
        </div>
        <form action={logout}>
          <button className="min-h-11 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--brand)] hover:bg-emerald-50" type="submit">Log out</button>
        </form>
      </div>

      {profileError || !profile ? (
        <p role="alert" className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          We could not load your profile. Confirm that the latest Supabase migration was applied, then try again.
        </p>
      ) : (
        <>
          <div className="mt-6 flex gap-4 text-sm text-[var(--muted)]">
            <span className="rounded-full bg-emerald-50 px-3 py-1 capitalize">{profile.role}</span>
            <span className="py-1">Member since {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(profile.created_at))}</span>
          </div>
          <ProfileForm
            action={updateProfile}
            profile={{
              displayName: profile.display_name,
              avatarUrl: profile.avatar_url ?? "",
              preferredLanguage: profile.preferred_language,
            }}
          />
        </>
      )}
    </section>
  );
}
