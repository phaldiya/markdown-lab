import { describe, expect, it } from 'vitest';

import { processMarkdown } from '../../src/lib/markdownPipeline';
import { COMPLEX_MARKDOWN, FRONTMATTER_MARKDOWN } from '../helpers/fixtures';

describe('pipeline deep tests', () => {
  it('processes complex markdown with all features', async () => {
    const result = await processMarkdown(COMPLEX_MARKDOWN);
    expect(result.html).toContain('<h1');
    expect(result.html).toContain('<h2');
    expect(result.html).toContain('<h3');
    expect(result.html).toContain('<table');
    expect(result.html).toContain('<code');
    expect(result.html).toContain('<blockquote');
    expect(result.html).toContain('<a');
    expect(result.frontmatter).toEqual({ title: 'Complex Document' });
  });

  it('handles frontmatter extraction through pipeline', async () => {
    const result = await processMarkdown(FRONTMATTER_MARKDOWN);
    expect(result.frontmatter?.title).toBe('Test Document');
    expect(result.frontmatter?.author).toBe('Test Author');
    expect(result.frontmatter?.tags).toEqual(['markdown', 'test']);
    expect(result.html).toContain('Content After Frontmatter');
    expect(result.html).not.toContain('title: Test Document');
  });

  it('generates IDs for headings', async () => {
    const result = await processMarkdown('# Hello World\n## Second Section');
    expect(result.html).toContain('id="user-content-hello-world"');
    expect(result.html).toContain('id="user-content-second-section"');
  });

  it('handles inline code', async () => {
    const result = await processMarkdown('Use `console.log()` for debugging');
    expect(result.html).toContain('<code>console.log()</code>');
  });

  it('handles links', async () => {
    const result = await processMarkdown('[Google](https://google.com)');
    expect(result.html).toContain('href="https://google.com"');
    expect(result.html).toContain('>Google</a>');
  });

  it('handles images', async () => {
    const result = await processMarkdown('![Alt text](image.png)');
    expect(result.html).toContain('<img');
    expect(result.html).toContain('alt="Alt text"');
  });

  it('handles horizontal rules', async () => {
    const result = await processMarkdown('Above\n\n---\n\nBelow');
    expect(result.html).toContain('<hr');
  });

  it('handles HTML entities', async () => {
    const result = await processMarkdown('5 &gt; 3');
    expect(result.html).toContain('5');
    expect(result.html).toContain('3');
  });
});
