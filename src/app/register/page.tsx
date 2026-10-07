import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/server";
import { register } from "../(auth)/actions";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/profile");

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Join us</p>
      <h1 className="mt-3 text-3xl font-semibold">Create account</h1>
      <p className="mt-3 leading-7 text-[var(--muted)]">Create your account to save your preferences and profile.</p>
      <AuthForm mode="register" action={register} />
    </section>
  );
}
