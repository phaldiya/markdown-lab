import { describe, expect, it } from 'vitest';

import { processMarkdown } from '../../src/lib/markdownPipeline';
import { GFM_MARKDOWN } from '../helpers/fixtures';

describe('GFM features', () => {
  it('renders tables', async () => {
    const result = await processMarkdown(GFM_MARKDOWN);
    expect(result.html).toContain('<table');
    expect(result.html).toContain('<th');
    expect(result.html).toContain('<td');
  });

  it('renders task lists', async () => {
    const result = await processMarkdown(GFM_MARKDOWN);
    expect(result.html).toContain('type="checkbox"');
    expect(result.html).toContain('checked');
  });

  it('renders strikethrough', async () => {
    const result = await processMarkdown(GFM_MARKDOWN);
    expect(result.html).toContain('<del>');
    expect(result.html).toContain('strikethrough');
  });

  it('renders autolinks', async () => {
    const result = await processMarkdown('Visit https://example.com for more info');
    expect(result.html).toContain('<a');
    expect(result.html).toContain('https://example.com');
  });
});
