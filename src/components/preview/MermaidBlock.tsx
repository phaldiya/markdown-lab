import DOMPurify from 'dompurify';
import { useEffect, useRef, useState } from 'react';

let mermaidInitialized = false;

async function getMermaid() {
  const mermaid = (await import('mermaid')).default;
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'loose',
    });
    mermaidInitialized = true;
  }
  return mermaid;
}

export default function MermaidBlock({ code, id }: { code: string; id: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = await getMermaid();
        const { svg } = await mermaid.render(`mermaid-${id}`, code);
        if (!cancelled && containerRef.current) {
          // Sanitize SVG output from mermaid before inserting into DOM
          containerRef.current.innerHTML = DOMPurify.sanitize(svg, {
            USE_PROFILES: { svg: true, svgFilters: true },
            ADD_TAGS: ['foreignObject'],
          });
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to render diagram');
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <div className="rounded border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 p-3">
        <p className="mb-2 font-medium text-[var(--color-error)] text-xs">Mermaid Error</p>
        <pre className="text-[var(--color-text-secondary)] text-xs">{error}</pre>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs">Source</summary>
          <pre className="mt-1 text-xs">
            <code>{code}</code>
          </pre>
        </details>
      </div>
    );
  }

  return <div ref={containerRef} className="mermaid-rendered" />;
}
