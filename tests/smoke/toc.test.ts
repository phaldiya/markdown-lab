import { describe, expect, it } from 'vitest';

import { extractToc } from '../../src/lib/tocExtractor';

describe('TOC extractor smoke tests', () => {
  it('extracts headings from markdown', () => {
    const md = '# H1\n## H2\n### H3';
    const toc = extractToc(md);
    expect(toc).toHaveLength(3);
    expect(toc[0]).toEqual({ id: 'h1', text: 'H1', level: 1 });
    expect(toc[1]).toEqual({ id: 'h2', text: 'H2', level: 2 });
    expect(toc[2]).toEqual({ id: 'h3', text: 'H3', level: 3 });
  });

  it('returns empty array for no headings', () => {
    expect(extractToc('no headings here')).toEqual([]);
  });

  it('slugifies heading text', () => {
    const toc = extractToc('# Hello World!');
    expect(toc[0].id).toBe('hello-world');
  });
});
