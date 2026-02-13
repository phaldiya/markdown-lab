import { describe, expect, it, vi } from 'vitest';

import { loadMarkdownFromUrl } from '../../src/lib/fileLoader';

describe('fileLoader smoke tests', () => {
  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' }));

    await expect(loadMarkdownFromUrl('https://example.com/test.md')).rejects.toThrow('Failed to load');
    vi.restoreAllMocks();
  });

  it('returns text content on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve('# Hello') }));

    const result = await loadMarkdownFromUrl('https://example.com/test.md');
    expect(result).toBe('# Hello');
    vi.restoreAllMocks();
  });
});
