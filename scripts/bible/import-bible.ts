import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { validateChapter } from "./validate-chapter";

async function main() {
const dryRun = process.argv.includes("--dry-run");
const source = await readFile(fileURLToPath(new URL("./fixtures/john-1.txt", import.meta.url)), "utf8");
const report = validateChapter(source);
const approved = report.verses.filter((verse) => !verse.endVerse);

console.log(`Parsed ${report.verses.length} source records; ${approved.length} individual verses approved.`);
for (const item of report.items) console.log(`${item.severity.toUpperCase()}: ${item.message}`);
if (!report.canImport) throw new Error("Critical validation errors block import.");
if (dryRun) { console.log("DRY RUN: no database changes made."); process.exit(0); }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and server-only SUPABASE_SERVICE_ROLE_KEY for import.");
const supabase = createClient(new URL(url).origin, key, { auth: { persistSession: false, autoRefreshToken: false } });
const [{ data: translation }, { data: book }] = await Promise.all([
  supabase.from("bible_translations").select("id").eq("code", "tir-local").single(),
  supabase.from("bible_books").select("id").eq("slug", "john").single(),
]);
if (!translation || !book) throw new Error("Apply the Bible catalog migration before importing.");
const rows = approved.map(v => ({ translation_id: translation.id, book_id: book.id, chapter_number: 1, verse_number: v.verse, text: v.text }));
const { error } = await supabase.from("bible_verses").upsert(rows, { onConflict: "translation_id,book_id,chapter_number,verse_number", ignoreDuplicates: false });
if (error) throw error;
console.log(`Imported ${rows.length} verses. Combined ranges remain unmodified for review.`);
}

void main();
