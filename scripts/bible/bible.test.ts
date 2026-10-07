import assert from "node:assert/strict";
import test from "node:test";
import { normalizeTigrinyaSource } from "./normalize-tigrinya";
import { parseChapter } from "./parse-chapter";
import { validateChapter } from "./validate-chapter";

test("parses normal verse numbering", () => assert.deepEqual(parseChapter("1 ሀ 2 ለ", 1).verses.map(v => v.verse), [1, 2]));
test("decodes encoded verse numbers", () => assert.equal(parseChapter("**&#x32; ሰላም", 1).verses[0].verse, 2));
test("flags combined verses without splitting", () => {
  const report = validateChapter("1 ሀ 2-3 ለ", "John", 1);
  assert.equal(report.verses.length, 2);
  assert.equal(report.items.some(i => i.code === "COMBINED_RANGE"), true);
});
test("decodes Ethiopic numeric entities", () => assert.equal(normalizeTigrinyaSource("&#x1295;ሱ"), "ንሱ"));
test("detects duplicate verse numbers", () => assert.equal(validateChapter("1 ሀ 1 ለ").items.some(i => i.code === "DUPLICATE"), true));
test("detects missing verse numbers", () => assert.equal(validateChapter("1 ሀ 3 ለ").items.some(i => i.code === "MISSING"), true));
test("preserves Tigrinya Unicode", () => assert.equal(parseChapter("1 ቃል ብመጀመርታ ነበረ።", 1).verses[0].text, "ቃል ብመጀመርታ ነበረ።"));
test("normalizes whitespace", () => assert.equal(normalizeTigrinyaSource("  ቃል\n\tነበረ  "), "ቃል ነበረ"));
