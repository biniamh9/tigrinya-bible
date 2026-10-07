import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseChapter } from "./parse-chapter";
import type { ReviewItem, ValidationReport } from "./types";

export function validateChapter(source: string, book = "John", chapter = 1): ValidationReport {
  const parsed = parseChapter(source, chapter);
  const items: ReviewItem[] = [...parsed.items];
  const seen = new Set<number>();
  let expected = 1;

  for (const verse of parsed.verses) {
    if (seen.has(verse.verse)) items.push({ severity: "critical", code: "DUPLICATE", label: verse.label, message: `Duplicate verse ${verse.verse}.` });
    if (verse.verse < expected) items.push({ severity: "critical", code: "OUT_OF_ORDER", label: verse.label, message: `Verse ${verse.label} is out of order.` });
    if (verse.verse > expected) items.push({ severity: "warning", code: "MISSING", label: verse.label, message: `Expected verse ${expected} before ${verse.label}.` });
    if (verse.endVerse) items.push({ severity: "review", code: "COMBINED_RANGE", label: verse.label, message: `Source combines verses ${verse.label}; it will not be imported automatically.` });
    if (!verse.text) items.push({ severity: "critical", code: "EMPTY_TEXT", label: verse.label, message: `Verse ${verse.label} has no text.` });
    if (/&#|\*\*/.test(verse.text)) items.push({ severity: "critical", code: "ARTIFACT", label: verse.label, message: `Formatting artifact remains near verse ${verse.label}.` });
    if (verse.text.includes("\uFFFD")) items.push({ severity: "critical", code: "INVALID_UNICODE", label: verse.label, message: `Replacement character remains near verse ${verse.label}.` });
    seen.add(verse.verse);
    expected = (verse.endVerse ?? verse.verse) + 1;
  }

  return { book, chapter, verses: parsed.verses, items, canImport: !items.some((item) => item.severity === "critical") };
}

async function main() {
  const source = await readFile(fileURLToPath(new URL("./fixtures/john-1.txt", import.meta.url)), "utf8");
  const report = validateChapter(source);
  console.log(`${report.book} ${report.chapter}: ${report.verses.length} source records`);
  for (const item of report.items) console.log(`${item.severity.toUpperCase()}: ${item.message}`);
  console.log(report.canImport ? "PASS: no critical errors" : "FAIL: critical errors block import");
  process.exitCode = report.canImport ? 0 : 1;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) void main();
