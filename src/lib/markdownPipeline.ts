import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkEmoji from 'remark-emoji';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import type { MarkdownResult } from '../types';
import { extractFrontmatter } from './frontmatterParser';
import { extractToc } from './tocExtractor';

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'math',
    'mi',
    'mo',
    'mn',
    'ms',
    'mtext',
    'mrow',
    'mfrac',
    'msup',
    'msub',
    'mover',
    'munder',
    'msqrt',
    'mroot',
    'mtable',
    'mtr',
    'mtd',
    'semantics',
    'annotation',
    'span',
    'div',
    'svg',
    'path',
    'circle',
    'rect',
    'line',
    'polyline',
    'polygon',
    'g',
    'text',
    'defs',
    'marker',
    'foreignObject',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'class', 'style', 'id'],
    span: [...(defaultSchema.attributes?.span ?? []), 'className', 'class', 'style', 'aria-hidden'],
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      'className',
      'class',
      'style',
      'data-mermaid',
      'dataMermaid',
      'data*',
    ],
    code: [...(defaultSchema.attributes?.code ?? []), 'className', 'class'],
    input: [...(defaultSchema.attributes?.input ?? []), 'type', 'checked', 'disabled'],
    svg: ['*'],
    path: ['*'],
    circle: ['*'],
    rect: ['*'],
    line: ['*'],
    polyline: ['*'],
    polygon: ['*'],
    g: ['*'],
    text: ['*'],
    defs: ['*'],
    marker: ['*'],
    foreignObject: ['*'],
  },
};

function remarkMermaidBlocks() {
  return (tree: Parameters<typeof visit>[0]) => {
    visit(tree, 'code', (node: { lang?: string; value?: string; type: string; data?: Record<string, unknown> }) => {
      if (node.lang === 'mermaid' && node.value) {
        node.type = 'html';
        const encoded = node.value.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        (node as unknown as { value: string }).value =
          `<div class="mermaid-block" data-mermaid="${encoded}"><pre class="mermaid-source"><code>${node.value}</code></pre></div>`;
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml'])
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkEmoji)
  .use(remarkMermaidBlocks)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeKatex)
  .use(rehypeHighlight, { detect: true, ignoreMissing: true })
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeStringify);

export async function processMarkdown(markdown: string): Promise<MarkdownResult> {
  const { frontmatter, content } = extractFrontmatter(markdown);
  const toc = extractToc(content);
  const file = await processor.process(content);
  const html = String(file);

  return { html, toc, frontmatter };
}
