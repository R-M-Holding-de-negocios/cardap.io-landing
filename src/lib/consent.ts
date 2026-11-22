export const CONSENT_KEY = 'cardapio-cookie-preferences';
export const CONSENT_VERSION = 1;

export type OptionalChoices = { analytics: boolean; advertising: boolean };
export type Consent = OptionalChoices & { version: number; savedAt: string };
export type ConsentCategory = 'necessary' | keyof OptionalChoices;

export function createConsent(choices: OptionalChoices, now = new Date()): Consent {
  return { version: CONSENT_VERSION, analytics: choices.analytics, advertising: choices.advertising, savedAt: now.toISOString() };
}

export function parseConsent(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const record = value as Record<string, unknown>;
    if (record.version !== CONSENT_VERSION || typeof record.analytics !== 'boolean' || typeof record.advertising !== 'boolean') return null;
    if (typeof record.savedAt !== 'string' || Number.isNaN(Date.parse(record.savedAt))) return null;
    return { version: CONSENT_VERSION, analytics: record.analytics, advertising: record.advertising, savedAt: record.savedAt };
  } catch {
    return null;
  }
}

export function isCategoryAllowed(consent: Consent | null, category: ConsentCategory): boolean {
  return category === 'necessary' || consent?.[category] === true;
}
