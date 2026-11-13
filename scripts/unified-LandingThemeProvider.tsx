'use client';

import type { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppTheme } from '@/components/AppThemeProvider';

export const useLandingTheme = useAppTheme;

export function LandingThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useAppTheme();
  const nextTheme = theme === 'light' ? 'dark' : 'light';
  const label = nextTheme === 'dark' ? 'Ativar tema escuro' : 'Ativar tema claro';
  const Icon = nextTheme === 'dark' ? Moon : Sun;
  return <button type="button" className={`landing-theme-toggle${compact ? ' landing-theme-toggle--compact' : ''}`} onClick={toggleTheme} aria-label={label} aria-pressed={theme === 'dark'} title={label}>
    <Icon aria-hidden="true" />{!compact && <span>{theme === 'light' ? 'Tema escuro' : 'Tema claro'}</span>}
  </button>;
}

export default function LandingThemeProvider({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { theme } = useAppTheme();
  return <div className={`presentation-theme home-theme min-h-screen bg-cream flex flex-col relative overflow-x-clip ${className}`.trim()} data-landing-theme={theme}>{children}</div>;
}
