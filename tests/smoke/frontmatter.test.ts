import { describe, expect, it } from 'vitest';

import { extractFrontmatter } from '../../src/lib/frontmatterParser';

describe('frontmatter parser smoke tests', () => {
  it('extracts YAML frontmatter', () => {
    const md = '---\ntitle: Test\nauthor: Author\n---\n\n# Content';
    const { frontmatter, content } = extractFrontmatter(md);
    expect(frontmatter).toEqual({ title: 'Test', author: 'Author' });
    expect(content).toBe('# Content');
  });

  it('returns null for no frontmatter', () => {
    const md = '# No Frontmatter';
    const { frontmatter, content } = extractFrontmatter(md);
    expect(frontmatter).toBeNull();
    expect(content).toBe('# No Frontmatter');
  });

  it('handles invalid YAML gracefully', () => {
    const md = '---\n: invalid: yaml: [[\n---\n\n# Content';
    const { frontmatter } = extractFrontmatter(md);
    expect(frontmatter).toBeNull();
  });
});
