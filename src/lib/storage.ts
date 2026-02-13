import type { AppState } from '../types';

const STORAGE_KEY = 'markdown-lab-state';

export function saveState(state: AppState): void {
  try {
    const serialized = JSON.stringify({
      editor: { content: state.editor.content },
      settings: state.settings,
      mode: state.mode,
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Storage full or unavailable
  }
}

export function loadState(): Partial<AppState> | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as Partial<AppState>;
  } catch {
    return null;
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
