import { describe, expect, it } from 'vitest';

import { computeWordCount } from '../../src/lib/wordCount';

describe('word count smoke tests', () => {
  it('counts words, chars, lines', () => {
    const stats = computeWordCount('Hello world\nSecond line');
    expect(stats.words).toBe(4);
    expect(stats.chars).toBe(23);
    expect(stats.lines).toBe(2);
    expect(stats.readTime).toBe(1);
  });

  it('returns zeros for empty string', () => {
    const stats = computeWordCount('');
    expect(stats.words).toBe(0);
    expect(stats.chars).toBe(0);
    expect(stats.lines).toBe(0);
    expect(stats.readTime).toBe(0);
  });

  it('handles whitespace-only string', () => {
    const stats = computeWordCount('   \n  \n  ');
    expect(stats.words).toBe(0);
  });
});
