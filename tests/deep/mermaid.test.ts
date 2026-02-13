import { describe, expect, it } from 'vitest';

import { processMarkdown } from '../../src/lib/markdownPipeline';
import { MERMAID_MARKDOWN } from '../helpers/fixtures';

describe('mermaid blocks', () => {
  it('converts mermaid code blocks to mermaid-block divs', async () => {
    const result = await processMarkdown(MERMAID_MARKDOWN);
    expect(result.html).toContain('mermaid-block');
    expect(result.html).toContain('mermaid-source');
  });

  it('preserves mermaid content in code element', async () => {
    const result = await processMarkdown(MERMAID_MARKDOWN);
    // Content is in the code element within the mermaid-block div
    expect(result.html).toContain('mermaid-block');
    expect(result.html).toContain('<code');
  });

  it('does not render mermaid as regular code block', async () => {
    const result = await processMarkdown(MERMAID_MARKDOWN);
    expect(result.html).not.toContain('language-mermaid');
  });
});
