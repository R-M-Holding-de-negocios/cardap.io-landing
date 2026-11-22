'use client';

import { OPEN_COOKIE_PREFERENCES } from './CookieConsent';

export default function CookiePreferencesButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES))} className="text-left underline hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">Preferências de cookies</button>;
}
