"use client";

import { useRouter } from "next/navigation";

export function ChapterSelect({ book, chapter, chapters }: { book: string; chapter: number; chapters: number[] }) {
  const router = useRouter();
  return <select aria-label="Chapter" className="rounded-lg border border-[var(--border)] bg-white px-3 py-2" value={chapter} onChange={(event) => router.push(`/bible/${book}/${event.target.value}`)}>{chapters.map(value => <option value={value} key={value}>{value}</option>)}</select>;
}
