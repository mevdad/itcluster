// Russian-language formatting for numbers and lists that come from content/site.ts.
// The values are edited by hand, so the wording must stay grammatical for any number: 1 площадка, 2 площадки, 5 площадок.

/** Noun forms for 1 / 2–4 / 5+ (e.g. «площадка», «площадки», «площадок»). */
export interface PluralForms {
  one: string;
  few: string;
  many: string;
}

/** Picks the noun form for an integer: 1, 21, 101 → one; 2–4, 22–24 → few; 0, 5–20, 11–14 → many. */
export function pluralRu(n: number, forms: PluralForms): string {
  const n10 = Math.abs(n) % 10;
  const n100 = Math.abs(n) % 100;
  if (n10 === 1 && n100 !== 11) return forms.one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms.few;
  return forms.many;
}

/** 53 + forms → «53 компании». */
export function countRu(n: number, forms: PluralForms): string {
  return `${n} ${pluralRu(n, forms)}`;
}

/** «Москва и Санкт-Петербург», «A, B и C». */
export function listRu(items: readonly string[]): string {
  return new Intl.ListFormat("ru", { type: "conjunction" }).format(items);
}

/** A calendar date written by hand in content files: "2026-10-16". */
export type IsoDate = `${number}-${number}-${number}`;

/**
 * "2026-10-16" → «16 октября 2026 г.». The date is read and printed in UTC, so the result never depends on the
 * time zone of the machine that builds the site.
 */
export function formatDateRu(date: IsoDate): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
