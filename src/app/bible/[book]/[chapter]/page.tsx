import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook, getChapter, getChapterNumbers } from "@/lib/bible/queries";
import { ChapterSelect } from "@/components/bible/chapter-select";

export default async function ChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book: slug, chapter: value } = await params; const chapter = Number(value); if (!Number.isInteger(chapter) || chapter < 1) notFound();
  const book = await getBook(slug); if (!book) notFound(); const [verses, chapters] = await Promise.all([getChapter(book.id, chapter), getChapterNumbers(book.id)]); if (!chapters.includes(chapter)) notFound();
  return <article><div className="flex items-center justify-between gap-3"><Link className="text-sm text-[var(--brand)]" href={`/bible/${slug}`}>← Chapters</Link><ChapterSelect book={slug} chapter={chapter} chapters={chapters} /></div><h1 className="mt-6 text-3xl font-semibold">{book.tigrinyaName}</h1><p className="mt-2 text-[var(--muted)]">Chapter {chapter}</p><ol className="mt-8 space-y-5">{verses.map(v => <li className="grid grid-cols-[2rem_1fr] gap-2 text-lg leading-9" key={v.verse}><span className="pt-1 text-sm font-semibold text-[var(--brand)]">{v.verse}</span><span>{v.text}</span></li>)}</ol><nav className="mt-10 flex justify-between border-t border-[var(--border)] pt-5">{chapters.includes(chapter - 1) ? <Link href={`/bible/${slug}/${chapter - 1}`}>← Previous</Link> : <span />}{chapters.includes(chapter + 1) && <Link href={`/bible/${slug}/${chapter + 1}`}>Next →</Link>}</nav></article>;
}
