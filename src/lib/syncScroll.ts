let isSyncing = false;

export function syncScroll(source: HTMLElement, target: HTMLElement) {
  if (isSyncing) return;
  isSyncing = true;

  const sourceMaxScroll = source.scrollHeight - source.clientHeight;
  const targetMaxScroll = target.scrollHeight - target.clientHeight;

  if (sourceMaxScroll > 0 && targetMaxScroll > 0) {
    const ratio = source.scrollTop / sourceMaxScroll;
    target.scrollTop = ratio * targetMaxScroll;
  }

  requestAnimationFrame(() => {
    isSyncing = false;
  });
}
