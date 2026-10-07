"use client";

import Link from "next/link";
import { useActionState } from "react";
import { initialFormState, type FormState } from "@/lib/auth/validation";

type AuthFormProps = {
  mode: "login" | "register";
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-red-700">{errors[0]}</p>;
}

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const registering = mode === "register";

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      {registering ? (
        <div>
          <label className="text-sm font-medium" htmlFor="displayName">Display Name</label>
          <input className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-base shadow-sm" id="displayName" name="displayName" autoComplete="name" required maxLength={80} aria-invalid={Boolean(state.errors?.displayName)} aria-describedby={state.errors?.displayName ? "displayName-error" : undefined} />
          <span id="displayName-error"><FieldError errors={state.errors?.displayName} /></span>
        </div>
      ) : null}

      <div>
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <input className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-base shadow-sm" id="email" name="email" type="email" inputMode="email" autoComplete="email" required aria-invalid={Boolean(state.errors?.email)} aria-describedby={state.errors?.email ? "email-error" : undefined} />
        <span id="email-error"><FieldError errors={state.errors?.email} /></span>
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="password">Password</label>
        <input className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-base shadow-sm" id="password" name="password" type="password" autoComplete={registering ? "new-password" : "current-password"} required minLength={registering ? 8 : undefined} aria-invalid={Boolean(state.errors?.password)} aria-describedby={state.errors?.password ? "password-error" : undefined} />
        <span id="password-error"><FieldError errors={state.errors?.password} /></span>
      </div>

      {registering ? (
        <div>
          <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm Password</label>
          <input className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-base shadow-sm" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} aria-invalid={Boolean(state.errors?.confirmPassword)} aria-describedby={state.errors?.confirmPassword ? "confirmPassword-error" : undefined} />
          <span id="confirmPassword-error"><FieldError errors={state.errors?.confirmPassword} /></span>
        </div>
      ) : null}

      {state.message ? (
        <p role={state.status === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm ${state.status === "error" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-[var(--brand)]"}`}>
          {state.message}
        </p>
      ) : null}

      <button className="min-h-12 w-full rounded-xl bg-[var(--brand)] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={pending}>
        {pending ? (registering ? "Creating account…" : "Signing in…") : (registering ? "Create Account" : "Sign In")}
      </button>

      <p className="text-center text-sm text-[var(--muted)]">
        {registering ? "Already have an account?" : "New to Tigrinya Bible?"}{" "}
        <Link className="font-semibold text-[var(--brand)] underline-offset-4 hover:underline" href={registering ? "/login" : "/register"}>
          {registering ? "Sign In" : "Create Account"}
        </Link>
      </p>
    </form>
  );
}
