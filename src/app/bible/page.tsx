import Link from "next/link";
import { getBooks } from "@/lib/bible/queries";

export default async function BiblePage() {
  const books = await getBooks();
  return <section><p className="text-sm font-semibold uppercase tracking-[.16em] text-[var(--brand)]">Scripture</p><h1 className="mt-3 text-3xl font-semibold">Bible</h1>
    {(["old", "new"] as const).map(testament => <div className="mt-8" key={testament}><h2 className="text-xl font-semibold">{testament === "old" ? "Old Testament" : "New Testament"}</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{books.filter(b => b.testament === testament).map(book => <li key={book.id}><Link className="block rounded-xl border border-[var(--border)] bg-white p-4 hover:bg-emerald-50" href={`/bible/${book.slug}`}><span className="font-semibold">{book.tigrinyaName}</span>{book.tigrinyaName !== book.englishName && <span className="ml-2 text-sm text-[var(--muted)]">{book.englishName}</span>}</Link></li>)}</ul></div>)}</section>;
}
