import type { TocHeading } from '../types';

const HEADING_RE = /^(#{1,6})\s+(.+)$/gm;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function extractToc(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];

  for (const match of markdown.matchAll(HEADING_RE)) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({
      id: slugify(text),
      text,
      level,
    });
  }

  return headings;
}
