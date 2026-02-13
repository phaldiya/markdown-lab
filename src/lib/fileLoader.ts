export async function loadMarkdownFromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

export function startAutoReload(url: string, onContent: (content: string) => void, intervalMs = 2000): () => void {
  let lastContent = '';
  let active = true;

  const poll = async () => {
    if (!active) return;
    try {
      const content = await loadMarkdownFromUrl(url);
      if (content !== lastContent) {
        lastContent = content;
        onContent(content);
      }
    } catch {
      // Silently ignore poll failures
    }
    if (active) {
      setTimeout(poll, intervalMs);
    }
  };

  poll();

  return () => {
    active = false;
  };
}
