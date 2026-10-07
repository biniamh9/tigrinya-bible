export type BibleBook = { id: string; canonicalOrder: number; testament: "old" | "new"; englishName: string; tigrinyaName: string; abbreviation: string; slug: string };
export type BibleVerse = { verse: number; text: string };
