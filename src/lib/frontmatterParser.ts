import { parse } from 'yaml';

import type { Frontmatter } from '../types';

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;

export function extractFrontmatter(markdown: string): { frontmatter: Frontmatter | null; content: string } {
  const match = FRONTMATTER_RE.exec(markdown);
  if (!match) {
    return { frontmatter: null, content: markdown };
  }

  try {
    const parsed = parse(match[1]) as Frontmatter;
    const content = markdown.slice(match[0].length).trimStart();
    return { frontmatter: parsed, content };
  } catch {
    return { frontmatter: null, content: markdown };
  }
}
