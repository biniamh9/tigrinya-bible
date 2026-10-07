"use client";

import { useActionState } from "react";
import { initialFormState, type FormState } from "@/lib/auth/validation";

type ProfileFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  profile: {
    displayName: string;
    avatarUrl: string;
    preferredLanguage: "ti" | "en";
  };
};

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? <p className="mt-1 text-sm text-red-700">{errors[0]}</p> : null;
}

export function ProfileForm({ action, profile }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <div>
        <label className="text-sm font-medium" htmlFor="displayName">Display Name</label>
        <input className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-base shadow-sm" id="displayName" name="displayName" defaultValue={profile.displayName} autoComplete="name" required maxLength={80} aria-invalid={Boolean(state.errors?.displayName)} />
        <FieldError errors={state.errors?.displayName} />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="avatarUrl">Avatar URL <span className="font-normal text-[var(--muted)]">(optional)</span></label>
        <input className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-base shadow-sm" id="avatarUrl" name="avatarUrl" type="url" inputMode="url" defaultValue={profile.avatarUrl} placeholder="https://example.com/avatar.jpg" aria-invalid={Boolean(state.errors?.avatarUrl)} />
        <FieldError errors={state.errors?.avatarUrl} />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="preferredLanguage">Preferred Language</label>
        <select className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-base shadow-sm" id="preferredLanguage" name="preferredLanguage" defaultValue={profile.preferredLanguage}>
          <option value="ti">ትግርኛ (Tigrinya)</option>
          <option value="en">English</option>
        </select>
      </div>

      {state.message ? (
        <p role={state.status === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm ${state.status === "error" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-[var(--brand)]"}`}>
          {state.message}
        </p>
      ) : null}

      <button className="min-h-12 rounded-xl bg-[var(--brand)] px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
