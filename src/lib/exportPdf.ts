import DOMPurify from 'dompurify';

export function exportAsPdf(html: string, title: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Sanitize the HTML content using DOMPurify before inserting
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ADD_TAGS: ['math', 'mi', 'mo', 'mn', 'ms', 'mtext', 'mrow', 'mfrac', 'msup', 'msub', 'semantics', 'annotation'],
    ADD_ATTR: ['class', 'style', 'id', 'aria-hidden', 'xmlns'],
  });

  const doc = printWindow.document;

  const head = doc.head;
  const meta = doc.createElement('meta');
  meta.setAttribute('charset', 'UTF-8');
  head.appendChild(meta);

  const titleEl = doc.createElement('title');
  titleEl.textContent = title;
  head.appendChild(titleEl);

  const katexLink = doc.createElement('link');
  katexLink.rel = 'stylesheet';
  katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.28/dist/katex.min.css';
  head.appendChild(katexLink);

  const hljsLink = doc.createElement('link');
  hljsLink.rel = 'stylesheet';
  hljsLink.href = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/github.min.css';
  head.appendChild(hljsLink);

  const style = doc.createElement('style');
  style.textContent = `
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 48rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.7; color: #1e293b; }
    h1 { font-size: 2em; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; }
    h2 { font-size: 1.5em; font-weight: 600; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
    pre { background: #f8fafc; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; }
    code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.875em; }
    :not(pre) > code { background: #f1f5f9; padding: 0.15rem 0.35rem; border-radius: 0.25rem; }
    blockquote { border-left: 4px solid #6366f1; padding: 0.5rem 1rem; background: #f8fafc; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; }
    th { background: #f1f5f9; }
    a { color: #6366f1; }
    img { max-width: 100%; }
    @media print { body { margin: 0; } }
  `;
  head.appendChild(style);

  // Use DOMPurify to safely parse and insert sanitized HTML into the document
  const sanitizedDom = DOMPurify.sanitize(sanitizedHtml, { RETURN_DOM: true });
  doc.body.appendChild(doc.adoptNode(sanitizedDom));

  printWindow.onload = () => printWindow.print();
}
