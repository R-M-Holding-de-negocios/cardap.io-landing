export type LandingTheme = 'light' | 'dark';
export const LANDING_THEME_STORAGE_KEY = 'cardapio-theme';

export function resolveLandingTheme(value: string | null): LandingTheme {
  return value === 'dark' ? 'dark' : 'light';
}
