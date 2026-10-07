import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { BibleBook, BibleVerse } from "./types";

export const getBooks = cache(async (): Promise<BibleBook[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("bible_books").select("id,canonical_order,testament,english_name,tigrinya_name,abbreviation,slug").order("canonical_order");
  if (error) throw new Error("Unable to load Bible books.");
  return data.map(b => ({ id: b.id, canonicalOrder: b.canonical_order, testament: b.testament, englishName: b.english_name, tigrinyaName: b.tigrinya_name, abbreviation: b.abbreviation, slug: b.slug }));
});

export const getBook = cache(async (slug: string) => (await getBooks()).find(book => book.slug === slug) ?? null);

export const getChapterNumbers = cache(async (bookId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("bible_verses").select("chapter_number").eq("book_id", bookId).order("chapter_number");
  if (error) throw new Error("Unable to load chapters.");
  return [...new Set(data.map(row => row.chapter_number))];
});

export const getChapter = cache(async (bookId: string, chapter: number): Promise<BibleVerse[]> => {
  const supabase = await createClient();
  const { data: translation } = await supabase.from("bible_translations").select("id").eq("code", "tir-local").eq("is_active", true).single();
  if (!translation) return [];
  const { data, error } = await supabase.from("bible_verses").select("verse_number,text").eq("translation_id", translation.id).eq("book_id", bookId).eq("chapter_number", chapter).order("verse_number");
  if (error) throw new Error("Unable to load this chapter.");
  return data.map(v => ({ verse: v.verse_number, text: v.text }));
});
