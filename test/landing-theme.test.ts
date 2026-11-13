import { describe, expect, it } from 'vitest';
import { LANDING_THEME_STORAGE_KEY, resolveLandingTheme } from '@/lib/landing-theme';

describe('landing theme preference', () => {
  it('uses the same preference key as the Cardapio.io application', () => {
    expect(LANDING_THEME_STORAGE_KEY).toBe('cardapio-theme');
  });

  it('restores valid preferences and defaults safely', () => {
    expect(resolveLandingTheme('dark')).toBe('dark');
    expect(resolveLandingTheme('light')).toBe('light');
    expect(resolveLandingTheme(null)).toBe('light');
    expect(resolveLandingTheme('unexpected')).toBe('light');
  });
});
