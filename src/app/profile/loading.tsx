export default function ProfileLoading() {
  return (
    <div aria-label="Loading profile" role="status" className="mx-auto max-w-xl animate-pulse rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
      <div className="h-4 w-20 rounded bg-slate-200" />
      <div className="mt-4 h-9 w-40 rounded bg-slate-200" />
      <div className="mt-8 h-12 rounded bg-slate-200" />
      <div className="mt-5 h-12 rounded bg-slate-200" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
