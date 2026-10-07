import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/server";
import { login } from "../(auth)/actions";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/profile");

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Welcome back</p>
      <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
      <p className="mt-3 leading-7 text-[var(--muted)]">Continue to your Tigrinya Bible account.</p>
      {query.error === "confirmation" ? (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          This confirmation link is invalid or expired. Please try signing in or create your account again.
        </p>
      ) : null}
      <AuthForm mode="login" action={login} />
    </section>
  );
}
