type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PagePlaceholder({ eyebrow, title, description }: PagePlaceholderProps) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight">{title}</h1>
      <p className="mt-4 max-w-prose text-lg leading-8 text-[var(--muted)]">{description}</p>
    </section>
  );
}
