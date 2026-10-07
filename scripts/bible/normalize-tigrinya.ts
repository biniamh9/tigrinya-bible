const numericEntity = /&#(?:x([0-9a-f]+)|(\d+));?/gi;

export function normalizeTigrinyaSource(source: string) {
  return source
    .replace(numericEntity, (match, hex: string | undefined, decimal: string | undefined) => {
      const codePoint = Number.parseInt(hex ?? decimal ?? "", hex ? 16 : 10);
      return Number.isSafeInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : match;
    })
    .replace(/\*\*/g, "")
    .normalize("NFC")
    .replace(/[\u00a0\t\r\n]+/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
}
