import { describe, expect, it } from 'vitest';
import { CONSENT_KEY, CONSENT_VERSION, createConsent, parseConsent, isCategoryAllowed } from '@/lib/consent';

describe('cookie preferences', () => {
  it('treats missing, malformed and older preferences as no optional consent', () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent('{oops')).toBeNull();
    expect(parseConsent(JSON.stringify({ version: 0, analytics: true, advertising: true }))).toBeNull();
    expect(isCategoryAllowed(null, 'analytics')).toBe(false);
    expect(isCategoryAllowed(null, 'advertising')).toBe(false);
    expect(isCategoryAllowed(null, 'necessary')).toBe(true);
  });

  it('persists explicit choices and rejects invalid optional values', () => {
    const choice = createConsent({ analytics: true, advertising: false }, new Date('2026-11-14T10:00:00.000Z'));
    expect(CONSENT_KEY).toBeTruthy();
    expect(parseConsent(JSON.stringify(choice))).toEqual(choice);
    expect(choice.version).toBe(CONSENT_VERSION);
    expect(isCategoryAllowed(choice, 'analytics')).toBe(true);
    expect(isCategoryAllowed(choice, 'advertising')).toBe(false);
    expect(parseConsent(JSON.stringify({ ...choice, advertising: 'yes' }))).toBeNull();
  });

  it('allows revocation by replacing previous optional choices', () => {
    const prior = createConsent({ analytics: true, advertising: true });
    const revoked = createConsent({ analytics: false, advertising: false });
    expect(isCategoryAllowed(prior, 'analytics')).toBe(true);
    expect(isCategoryAllowed(revoked, 'analytics')).toBe(false);
    expect(isCategoryAllowed(revoked, 'advertising')).toBe(false);
  });
});
