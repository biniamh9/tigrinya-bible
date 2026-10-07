export type ParsedVerse = { chapter: number; label: string; verse: number; endVerse?: number; text: string };
export type ReviewSeverity = "warning" | "review" | "critical";
export type ReviewItem = { severity: ReviewSeverity; code: string; message: string; label?: string };
export type ValidationReport = { book: string; chapter: number; verses: ParsedVerse[]; items: ReviewItem[]; canImport: boolean };
