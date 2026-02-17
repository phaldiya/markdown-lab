function buildFullHtml(html: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.28/dist/katex.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/github.min.css">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 48rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.7; color: #1e293b; }
    h1 { font-size: 2em; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; }
    h2 { font-size: 1.5em; font-weight: 600; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
    h3 { font-size: 1.25em; font-weight: 600; }
    pre { background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; border: 1px solid #e2e8f0; }
    code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.875em; }
    :not(pre) > code { background: #f1f5f9; padding: 0.15rem 0.35rem; border-radius: 0.25rem; }
    blockquote { margin: 0.75rem 0; padding: 0.5rem 1rem; border-left: 4px solid #6366f1; background: #f1f5f9; }
    table { width: 100%; border-collapse: collapse; margin: 0.75rem 0; }
    th, td { padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; }
    a { color: #6366f1; }
    img { max-width: 100%; }
    hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.5rem 0; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
}

export async function copyHtmlToClipboard(html: string, title: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(buildFullHtml(html, title));
    return true;
  } catch {
    return false;
  }
}

export function exportAsHtml(html: string, title: string) {
  const fullHtml = buildFullHtml(html, title);

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
