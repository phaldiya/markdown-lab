import { describe, expect, it } from 'vitest';

import { processMarkdown } from '../../src/lib/markdownPipeline';
import { MATH_MARKDOWN } from '../helpers/fixtures';

describe('math rendering', () => {
  it('renders inline math with KaTeX', async () => {
    const result = await processMarkdown(MATH_MARKDOWN);
    expect(result.html).toContain('katex');
  });

  it('renders display math', async () => {
    const result = await processMarkdown(MATH_MARKDOWN);
    expect(result.html).toContain('katex-display');
  });

  it('handles simple inline math', async () => {
    const result = await processMarkdown('The formula $x^2$ is simple');
    expect(result.html).toContain('katex');
  });
});
