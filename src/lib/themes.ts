import type { ThemeId } from '../types';

interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryHover: string;
}

export const themes: Record<ThemeId, { label: string; dark: boolean; colors: ThemeColors }> = {
  'github-light': {
    label: 'GitHub Light',
    dark: false,
    colors: {
      bg: '#f8fafc',
      surface: '#ffffff',
      surfaceAlt: '#f1f5f9',
      border: '#e2e8f0',
      text: '#1e293b',
      textSecondary: '#475569',
      primary: '#6366f1',
      primaryHover: '#4f46e5',
    },
  },
  'github-dark': {
    label: 'GitHub Dark',
    dark: true,
    colors: {
      bg: '#0d1117',
      surface: '#161b22',
      surfaceAlt: '#21262d',
      border: '#30363d',
      text: '#c9d1d9',
      textSecondary: '#8b949e',
      primary: '#58a6ff',
      primaryHover: '#79c0ff',
    },
  },
  dracula: {
    label: 'Dracula',
    dark: true,
    colors: {
      bg: '#282a36',
      surface: '#343746',
      surfaceAlt: '#44475a',
      border: '#6272a4',
      text: '#f8f8f2',
      textSecondary: '#6272a4',
      primary: '#bd93f9',
      primaryHover: '#ff79c6',
    },
  },
  'solarized-light': {
    label: 'Solarized Light',
    dark: false,
    colors: {
      bg: '#fdf6e3',
      surface: '#eee8d5',
      surfaceAlt: '#e8e1cb',
      border: '#93a1a1',
      text: '#657b83',
      textSecondary: '#839496',
      primary: '#268bd2',
      primaryHover: '#2aa198',
    },
  },
  'solarized-dark': {
    label: 'Solarized Dark',
    dark: true,
    colors: {
      bg: '#002b36',
      surface: '#073642',
      surfaceAlt: '#0a4a5a',
      border: '#586e75',
      text: '#839496',
      textSecondary: '#657b83',
      primary: '#268bd2',
      primaryHover: '#2aa198',
    },
  },
};

export function applyTheme(themeId: ThemeId) {
  const theme = themes[themeId];
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty('--color-bg', theme.colors.bg);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-surface-alt', theme.colors.surfaceAlt);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-primary-hover', theme.colors.primaryHover);

  root.classList.toggle('dark', theme.dark);
}
