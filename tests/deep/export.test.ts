import { describe, expect, it } from 'vitest';

import { processMarkdown } from '../../src/lib/markdownPipeline';
import { BASIC_MARKDOWN, MATH_MARKDOWN } from '../helpers/fixtures';

describe('export pipeline integration', () => {
  it('produces valid HTML for export', async () => {
    const result = await processMarkdown(BASIC_MARKDOWN);
    expect(result.html).toContain('<h1');
    expect(result.html).toContain('</h1>');
    expect(result.html).not.toContain('<script');
  });

  it('includes KaTeX markup for math export', async () => {
    const result = await processMarkdown(MATH_MARKDOWN);
    expect(result.html).toContain('katex');
  });

  it('does not include raw markdown in output', async () => {
    const result = await processMarkdown('# Title\n\n**bold** text');
    expect(result.html).not.toContain('# Title');
    expect(result.html).not.toContain('**bold**');
    expect(result.html).toContain('<strong>bold</strong>');
  });
});
