import { describe, expect, it } from 'vitest';

import { processMarkdown } from '../../src/lib/markdownPipeline';
import { BASIC_MARKDOWN } from '../helpers/fixtures';

describe('pipeline smoke tests', () => {
  it('processes basic markdown to HTML', async () => {
    const result = await processMarkdown(BASIC_MARKDOWN);
    expect(result.html).toContain('<h1');
    expect(result.html).toContain('Hello World');
    expect(result.html).toContain('<h2');
    expect(result.html).toContain('<li>');
  });

  it('returns empty html for empty input', async () => {
    const result = await processMarkdown('');
    expect(result.html).toBe('');
    expect(result.toc).toEqual([]);
    expect(result.frontmatter).toBeNull();
  });

  it('extracts TOC headings', async () => {
    const result = await processMarkdown(BASIC_MARKDOWN);
    expect(result.toc.length).toBe(2);
    expect(result.toc[0].text).toBe('Hello World');
    expect(result.toc[0].level).toBe(1);
    expect(result.toc[1].text).toBe('Second Heading');
    expect(result.toc[1].level).toBe(2);
  });
});
