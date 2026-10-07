import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook, getChapterNumbers } from "@/lib/bible/queries";

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params; const book = await getBook(slug); if (!book) notFound();
  const chapters = await getChapterNumbers(book.id);
  return <section><Link className="text-sm text-[var(--brand)]" href="/bible">← All books</Link><h1 className="mt-4 text-3xl font-semibold">{book.tigrinyaName}</h1><p className="mt-2 text-[var(--muted)]">{book.englishName}</p><h2 className="mt-8 font-semibold">Chapters</h2>{chapters.length ? <div className="mt-4 grid grid-cols-5 gap-3">{chapters.map(chapter => <Link className="rounded-xl border border-[var(--border)] bg-white p-3 text-center font-semibold" href={`/bible/${slug}/${chapter}`} key={chapter}>{chapter}</Link>)}</div> : <p className="mt-4 text-[var(--muted)]">No chapters have been imported yet.</p>}</section>;
}
