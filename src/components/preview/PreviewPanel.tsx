import DOMPurify from 'dompurify';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppContext } from '../../context/AppContext';
import FrontmatterDisplay from './FrontmatterDisplay';
import MermaidBlock from './MermaidBlock';

interface MermaidInfo {
  code: string;
  id: string;
}

function extractMermaidBlocks(html: string): MermaidInfo[] {
  const blocks: MermaidInfo[] = [];
  if (typeof DOMParser === 'undefined') return blocks;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('.mermaid-block').forEach((block, i) => {
    const code = block.querySelector('code')?.textContent ?? '';
    if (code) {
      blocks.push({ code, id: `${i}-${code.slice(0, 20).replace(/\W/g, '')}` });
    }
  });
  return blocks;
}

export default function PreviewPanel({ className = '' }: { className?: string }) {
  const { state, dispatch } = useAppContext();
  const previewRef = useRef<HTMLDivElement>(null);
  const [mermaidBlocks, setMermaidBlocks] = useState<MermaidInfo[]>([]);

  const sanitizedHtml = DOMPurify.sanitize(state.preview.html, {
    ADD_TAGS: [
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
    ],
    ADD_ATTR: ['class', 'style', 'id', 'data-mermaid', 'aria-hidden', 'xmlns', 'encoding'],
  });

  useEffect(() => {
    setMermaidBlocks(extractMermaidBlocks(sanitizedHtml));
  }, [sanitizedHtml]);

  const handleCheckboxToggle = useCallback(
    (e: Event) => {
      const target = e.target as HTMLElement;
      if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;

      const allCheckboxes = previewRef.current?.querySelectorAll('input[type="checkbox"]');
      if (!allCheckboxes) return;

      const index = Array.from(allCheckboxes).indexOf(target);
      if (index === -1) return;

      const lines = state.editor.content.split('\n');
      let checkboxCount = 0;
      for (let i = 0; i < lines.length; i++) {
        const match = /^(\s*[-*+]\s+)\[([ xX])\]/.exec(lines[i]);
        if (match) {
          if (checkboxCount === index) {
            const checked = match[2] !== ' ';
            lines[i] = lines[i].replace(/\[([ xX])\]/, checked ? '[ ]' : '[x]');
            dispatch({ type: 'SET_CONTENT', content: lines.join('\n') });
            break;
          }
          checkboxCount++;
        }
      }
    },
    [state.editor.content, dispatch],
  );

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    el.addEventListener('change', handleCheckboxToggle);
    return () => el.removeEventListener('change', handleCheckboxToggle);
  }, [handleCheckboxToggle]);

  return (
    <div className={`flex-1 overflow-y-auto ${className}`} ref={previewRef}>
      <div className="mx-auto max-w-4xl p-6">
        {state.preview.frontmatter && <FrontmatterDisplay frontmatter={state.preview.frontmatter} />}
        <div
          className="markdown-preview"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is sanitized by both rehype-sanitize and DOMPurify
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
        {mermaidBlocks.map((block) => (
          <MermaidBlock key={block.id} code={block.code} id={block.id} />
        ))}
      </div>
    </div>
  );
}
