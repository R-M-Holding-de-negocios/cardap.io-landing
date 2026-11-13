'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import { LANDING_THEME_STORAGE_KEY, resolveLandingTheme, type LandingTheme } from '@/lib/landing-theme';

type LandingThemeContextValue = { theme: LandingTheme; toggleTheme: () => void };

const LandingThemeContext = createContext<LandingThemeContextValue | null>(null);
const SWEEP_DURATION = 780;
const COLOR_TRANSITION_DURATION = 190;

export function useLandingTheme() {
  const context = useContext(LandingThemeContext);
  if (!context) throw new Error('useLandingTheme must be used inside LandingThemeProvider');
  return context;
}

export function LandingThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useLandingTheme();
  const nextTheme = theme === 'light' ? 'dark' : 'light';
  const label = nextTheme === 'dark' ? 'Ativar tema escuro' : 'Ativar tema claro';
  const Icon = nextTheme === 'dark' ? Moon : Sun;

  return (
    <button
      type="button"
      className={`landing-theme-toggle${compact ? ' landing-theme-toggle--compact' : ''}`}
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={theme === 'dark'}
      title={label}
    >
      <Icon aria-hidden="true" />
      {!compact && <span>{theme === 'light' ? 'Tema escuro' : 'Tema claro'}</span>}
    </button>
  );
}

export default function LandingThemeProvider({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cleanupTimerRef = useRef<number | null>(null);
  const viewTransitionRef = useRef<ViewTransition | null>(null);
  const scrollLockRef = useRef<{ html: string; body: string } | null>(null);
  const [theme, setTheme] = useState<LandingTheme>('light');

  useEffect(() => {
    const apply = (value: string | null) => {
      const preference = resolveLandingTheme(value);
      if (rootRef.current) rootRef.current.dataset.landingTheme = preference;
      setTheme(preference);
    };
    try { apply(window.localStorage.getItem(LANDING_THEME_STORAGE_KEY)); }
    catch { apply(null); }
    const onStorage = (event: StorageEvent) => {
      if (event.key === LANDING_THEME_STORAGE_KEY) apply(event.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const releaseScrollLock = useCallback(() => {
    const previous = scrollLockRef.current;
    if (!previous) return;
    document.documentElement.style.overflow = previous.html;
    document.body.style.overflow = previous.body;
    scrollLockRef.current = null;
  }, []);

  const clearSweep = useCallback(() => {
    if (cleanupTimerRef.current !== null) window.clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = null;
    viewTransitionRef.current?.skipTransition();
    viewTransitionRef.current = null;
    releaseScrollLock();
    document.documentElement.classList.remove('landing-organic-theme-transition');
    rootRef.current?.classList.remove('landing-theme-sweeping');
    rootRef.current?.style.removeProperty('--landing-theme-delay');
    rootRef.current?.querySelectorAll<HTMLElement>('[style*="--landing-theme-delay"]').forEach(element => {
      element.style.removeProperty('--landing-theme-delay');
    });
  }, [releaseScrollLock]);

  const toggleTheme = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    clearSweep();
    const nextTheme: LandingTheme = theme === 'light' ? 'dark' : 'light';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const changeTheme = () => {
      root.dataset.landingTheme = nextTheme;
      flushSync(() => setTheme(nextTheme));
      try { window.localStorage.setItem(LANDING_THEME_STORAGE_KEY, nextTheme); }
      catch { /* Theme remains usable when browser storage is unavailable. */ }
    };

    if (reduceMotion) {
      changeTheme();
      return;
    }

    if (document.startViewTransition) {
      const html = document.documentElement;
      html.classList.add('landing-organic-theme-transition');
      const transition = document.startViewTransition(() => {
        changeTheme();
      });
      viewTransitionRef.current = transition;
      scrollLockRef.current = { html: html.style.overflow, body: document.body.style.overflow };
      html.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      const clearViewTransition = () => {
        if (viewTransitionRef.current !== transition) return;
        viewTransitionRef.current = null;
        if (cleanupTimerRef.current !== null) window.clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
        releaseScrollLock();
        html.classList.remove('landing-organic-theme-transition');
      };
      cleanupTimerRef.current = window.setTimeout(() => {
        transition.skipTransition();
        clearViewTransition();
      }, 950);
      void transition.finished.then(clearViewTransition, clearViewTransition);
      return;
    }

    changeTheme();
    const viewportHeight = window.innerHeight || 1;
    const visibleElements = root.querySelectorAll<HTMLElement>('*:not(script):not(style)');
    const rootRect = root.getBoundingClientRect();
    const rootCenterY = Math.max(0, Math.min(viewportHeight, rootRect.top + Math.min(rootRect.height, viewportHeight) / 2));
    root.style.setProperty(
      '--landing-theme-delay',
      `${(rootCenterY / viewportHeight) * (SWEEP_DURATION - COLOR_TRANSITION_DURATION)}ms`,
    );
    visibleElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= viewportHeight) return;
      const centerY = Math.max(0, Math.min(viewportHeight, rect.top + rect.height / 2));
      const delay = Math.max(0, Math.min(1, centerY / viewportHeight)) *
        (SWEEP_DURATION - COLOR_TRANSITION_DURATION);
      element.style.setProperty('--landing-theme-delay', `${delay}ms`);
    });

    root.classList.add('landing-theme-sweeping');
    cleanupTimerRef.current = window.setTimeout(
      clearSweep,
      SWEEP_DURATION + COLOR_TRANSITION_DURATION + 30,
    );
  }, [clearSweep, releaseScrollLock, theme]);

  useEffect(() => clearSweep, [clearSweep]);

  return (
    <LandingThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        ref={rootRef}
        className={`presentation-theme home-theme min-h-screen bg-cream flex flex-col relative overflow-x-clip ${className}`.trim()}
        data-landing-theme={theme}
      >
        {children}
      </div>
    </LandingThemeContext.Provider>
  );
}
