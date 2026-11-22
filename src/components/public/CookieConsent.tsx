'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CONSENT_KEY, createConsent, parseConsent, type Consent, type OptionalChoices } from '@/lib/consent';

export const OPEN_COOKIE_PREFERENCES = 'cardapio:open-cookie-preferences';
const none: OptionalChoices = { analytics: false, advertising: false };

export default function CookieConsent() {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [choices, setChoices] = useState<OptionalChoices>(none);

  useEffect(() => {
    let saved: Consent | null = null;
    try { saved = parseConsent(window.localStorage.getItem(CONSENT_KEY)); } catch { /* Private browsing may deny storage. */ }
    setConsent(saved);
    setChoices(saved ? { analytics: saved.analytics, advertising: saved.advertising } : none);
    setOpen(!saved);
    setReady(true);
    const show = () => { setCustomizing(true); setOpen(true); };
    const sync = (event: StorageEvent) => {
      if (event.key !== CONSENT_KEY) return;
      const next = parseConsent(event.newValue);
      setConsent(next);
      setChoices(next ? { analytics: next.analytics, advertising: next.advertising } : none);
      setOpen(!next);
    };
    window.addEventListener(OPEN_COOKIE_PREFERENCES, show);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(OPEN_COOKIE_PREFERENCES, show);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const save = (selection: OptionalChoices) => {
    const next = createConsent(selection);
    try { window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next)); } catch { /* Choice applies for this page only. */ }
    setConsent(next);
    setChoices(selection);
    setOpen(false);
    setCustomizing(false);
    window.dispatchEvent(new CustomEvent('cardapio:cookie-preferences-changed', { detail: next }));
  };

  if (!ready || !open) return null;
  return (
    <section aria-label="Preferências de privacidade" className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border-2 border-orange-300 bg-cream p-5 text-ink shadow-2xl sm:bottom-6 sm:p-6" role="region">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black">Privacidade e armazenamento</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Usamos armazenamento local para guardar seu tema e esta escolha. Atualmente esta landing não carrega analytics nem publicidade. Se essas tecnologias forem adicionadas, só poderão ser ativadas após sua autorização. Saiba mais na <Link className="font-semibold underline" href="/politica-de-privacidade">Política de Privacidade</Link> e na <Link className="font-semibold underline" href="/politica-de-cookies">Política de Cookies</Link>.</p>
        </div>
        {consent && <button type="button" onClick={() => setOpen(false)} aria-label="Fechar preferências" className="shrink-0 rounded-lg px-2 py-1 text-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">×</button>}
      </div>
      {customizing && <fieldset className="mt-4 space-y-3 rounded-xl border border-outline p-4">
        <legend className="px-1 font-bold">Escolha por categoria</legend>
        <p className="text-sm">Necessários: armazenamento do tema e da preferência de privacidade. Sempre ativos.</p>
        <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={choices.analytics} onChange={e => setChoices(current => ({ ...current, analytics: e.target.checked }))} className="h-5 w-5 accent-orange-700" /> Analíticos (nenhum ativo atualmente)</label>
        <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={choices.advertising} onChange={e => setChoices(current => ({ ...current, advertising: e.target.checked }))} className="h-5 w-5 accent-orange-700" /> Publicidade (nenhum ativo atualmente)</label>
      </fieldset>}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={() => save({ analytics: true, advertising: true })} className="min-h-11 rounded-full bg-action px-5 py-2 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">Aceitar todos</button>
        <button type="button" onClick={() => save(none)} className="min-h-11 rounded-full border border-action px-5 py-2 font-bold text-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">Rejeitar opcionais</button>
        {customizing
          ? <button type="button" onClick={() => save(choices)} className="min-h-11 rounded-full border border-outline px-5 py-2 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">Salvar escolhas</button>
          : <button type="button" onClick={() => setCustomizing(true)} className="min-h-11 rounded-full border border-outline px-5 py-2 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">Personalizar</button>}
      </div>
    </section>
  );
}
