'use client';

// Plano Pro "em breve" (F3-T3 do repositório Anfc-Cardapios): no lugar do botão de contratar,
// um formulário de interesse que cai na central de atendimento do admin.
import { useState, type FormEvent } from 'react';

type Fields = { name: string; email: string; restaurantName: string; message: string };

export function waitlistPayload(fields: Fields) {
  const payload: Record<string, string> = { name: fields.name.trim(), email: fields.email.trim() };
  if (fields.restaurantName.trim()) payload.restaurantName = fields.restaurantName.trim();
  if (fields.message.trim()) payload.message = fields.message.trim();
  return payload;
}

const input = 'mt-1 min-h-11 w-full rounded-xl border border-outline bg-white p-2.5 text-sm text-ink';

export default function ProWaitlist() {
  const [open, setOpen] = useState(false), [sending, setSending] = useState(false);
  const [done, setDone] = useState(false), [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setError('');
    const form = new FormData(event.currentTarget), text = (key: string) => String(form.get(key) || '');
    try {
      const response = await fetch('/api/public/pro-waitlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(waitlistPayload({ name: text('name'), email: text('email'), restaurantName: text('restaurantName'), message: text('message') })) });
      if (response.status === 429) throw new Error('Muitas tentativas. Tente de novo mais tarde.');
      if (!response.ok) throw new Error('Confira o nome e o e-mail e tente de novo.');
      setDone(true);
    } catch (cause) { setError(cause instanceof Error && cause.message !== 'Failed to fetch' ? cause.message : 'Falha de conexão. Tente novamente.'); }
    finally { setSending(false); }
  }

  if (done) return <p role="status" className="rounded-xl bg-peach p-3 text-center text-sm font-bold text-ink">Pronto! Avisaremos você quando o Pro estiver disponível.</p>;
  return <div className="space-y-3">
    <p className="rounded-xl border border-outline py-2 text-center text-sm font-bold text-muted">Em breve</p>
    {!open ? <button type="button" onClick={() => setOpen(true)} className="w-full rounded-xl border border-outline bg-cream py-3.5 text-sm font-bold text-muted hover:bg-peach">Quero ser avisado</button>
      : <form onSubmit={submit} className="space-y-2 text-left">
        <label className="block text-xs font-bold text-muted">Seu nome<input name="name" required maxLength={100} autoComplete="name" className={input} /></label>
        <label className="block text-xs font-bold text-muted">E-mail<input name="email" type="email" required maxLength={254} autoComplete="email" className={input} /></label>
        <label className="block text-xs font-bold text-muted">Restaurante (opcional)<input name="restaurantName" maxLength={120} className={input} /></label>
        <label className="block text-xs font-bold text-muted">O que você espera do Pro? (opcional)<textarea name="message" maxLength={2000} rows={2} className={input} /></label>
        {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
        <button type="submit" disabled={sending} className="w-full rounded-xl bg-action py-3 text-sm font-bold text-ink disabled:opacity-60">{sending ? 'Enviando…' : 'Entrar na lista de espera'}</button>
      </form>}
  </div>;
}
