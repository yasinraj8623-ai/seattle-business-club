export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const htmlToText = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** ~200 wpm, minimum 1 minute. */
export function readTimeMinutes(html: string) {
  const words = htmlToText(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
