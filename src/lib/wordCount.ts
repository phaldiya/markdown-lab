import type { WordCountStats } from '../types';

const WORDS_PER_MINUTE = 200;

export function computeWordCount(text: string): WordCountStats {
  const trimmed = text.trim();
  if (!trimmed) {
    return { words: 0, chars: 0, lines: 0, readTime: 0 };
  }

  const words = trimmed.split(/\s+/).length;
  const chars = trimmed.length;
  const lines = text.split('\n').length;
  const readTime = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  return { words, chars, lines, readTime };
}
