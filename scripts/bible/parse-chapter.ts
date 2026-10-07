import { normalizeTigrinyaSource } from "./normalize-tigrinya";
import type { ParsedVerse, ReviewItem } from "./types";

const marker = /(?:^|\s)(\d{1,3}(?:\s*[-–—]\s*\d{1,3})?)(?=\s)/g;

export function parseChapter(source: string, chapter: number) {
  const normalized = normalizeTigrinyaSource(source);
  const matches = [...normalized.matchAll(marker)];
  const verses: ParsedVerse[] = [];
  const items: ReviewItem[] = [];

  if (!matches.length) items.push({ severity: "critical", code: "NO_VERSES", message: "No verse markers were found." });
  const prefix = normalized.slice(0, matches[0]?.index ?? 0).trim();
  if (prefix) items.push({ severity: "warning", code: "SOURCE_PREFIX", message: `Ignored source heading: ${prefix}` });

  matches.forEach((match, index) => {
    const label = match[1].replace(/\s/g, "").replace(/[–—]/g, "-");
    const [startText, endText] = label.split("-");
    const textStart = (match.index ?? 0) + match[0].length;
    const textEnd = matches[index + 1]?.index ?? normalized.length;
    const text = normalized.slice(textStart, textEnd).trim();
    verses.push({ chapter, label, verse: Number(startText), endVerse: endText ? Number(endText) : undefined, text });
  });

  return { normalized, verses, items };
}
