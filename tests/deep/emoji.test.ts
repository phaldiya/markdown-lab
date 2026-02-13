import { describe, expect, it } from 'vitest';

import { processMarkdown } from '../../src/lib/markdownPipeline';

describe('emoji rendering', () => {
  it('converts emoji shortcodes', async () => {
    const result = await processMarkdown('This is :rocket: great!');
    expect(result.html).not.toContain(':rocket:');
    expect(result.html).toContain('\u{1F680}');
  });

  it('handles multiple emoji shortcodes', async () => {
    const result = await processMarkdown(':star: and :heart:');
    expect(result.html).not.toContain(':star:');
    expect(result.html).not.toContain(':heart:');
  });

  it('leaves unknown shortcodes unchanged', async () => {
    const result = await processMarkdown(':not_a_real_emoji_code:');
    expect(result.html).toContain(':not_a_real_emoji_code:');
  });
});
