'use client';
import { useState } from 'react';
import BillingCheckResult, { type BillingCheck } from '@/components/platform-admin/BillingCheckResult';
import { BILLING_ACTIONS, CONTRACT_STATUS_LABELS, billingErrorLabel, label, type BillingActionName } from '@/lib/platform-admin-billing';

const button = 'min-h-11 rounded-full border border-outline px-4 font-bold text-action disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action';

// Cada ação envia só o motivo. Quem decide se a conta pode ser liberada é o servidor, depois
// de consultar o Asaas; a tela mostra a resposta, inclusive a recusa.
export default function BillingActions({ id, onChanged }: { id: string; onChanged: () => void }) {
  const [target, setTarget] = useState<BillingActionName | null>(null), [reason, setReason] = useState(''), [busy, setBusy] = useState(false);
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [check, setCheck] = useState<BillingCheck | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!target || reason.trim().length < 3) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/platform-admin/restaurants/${encodeURIComponent(id)}/${target}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reason }) });
      const data = await response.json().catch(() => ({})) as Record<string, unknown>;
      if (!response.ok) throw Error(typeof data.error === 'string' ? data.error : 'Ação não concluída.');
      if (target === 'billing-check') setCheck(data as unknown as BillingCheck);
      if (target === 'billing-retry') {
        const failure = billingErrorLabel(typeof data.lastErrorCode === 'string' ? data.lastErrorCode : null);
        setNotice(`Resultado: ${label(CONTRACT_STATUS_LABELS, String(data.status || ''))}.${failure ? ` ${failure}` : ''}`);
      }
      if (target === 'billing-release') setNotice('Conta liberada: o Asaas confirmou o pagamento desta cobrança.');
      setTarget(null); setReason('');
      if (target !== 'billing-check') onChanged();
    } catch (e) { setError(e instanceof Error ? e.message : 'Ação não concluída.'); }
    finally { setBusy(false); }
  }

  return <section aria-labelledby="billing-actions-title" className="space-y-3">
    <h2 id="billing-actions-title" className="text-xl font-black">Ações de cobrança</h2>
    <ul className="grid gap-3 lg:grid-cols-3">
      {(Object.keys(BILLING_ACTIONS) as BillingActionName[]).map(name => <li key={name} className="flex flex-col gap-3 rounded-2xl border border-outline bg-white p-5">
        <p className="text-sm text-muted">{BILLING_ACTIONS[name].help}</p>
        <button type="button" onClick={() => { setTarget(name); setReason(''); setError(''); }} className={`${button} mt-auto`}>{BILLING_ACTIONS[name].title}</button>
      </li>)}
    </ul>
    {notice && <p role="status" className="rounded-xl border border-outline bg-white p-3 font-bold">{notice}</p>}
    {error && !target && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 font-bold text-red-900">{error}</p>}
    {check && <BillingCheckResult result={check} />}
    {target && <div role="dialog" aria-modal="true" aria-label={BILLING_ACTIONS[target].title} className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 text-ink">
        <h3 className="text-xl font-black">{BILLING_ACTIONS[target].title}</h3>
        <p className="text-sm text-muted">{BILLING_ACTIONS[target].help}</p>
        <label className="block text-sm font-bold">Motivo (fica na auditoria)
          <textarea required minLength={3} maxLength={500} value={reason} onChange={e => setReason(e.target.value)} className="mt-1 block min-h-24 w-full rounded-xl border border-outline p-3" />
        </label>
        {error && <p role="alert" className="font-bold text-red-700">{error}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" disabled={busy} onClick={() => { setTarget(null); setError(''); }} className={button}>Cancelar</button>
          <button type="submit" disabled={busy || reason.trim().length < 3} className="min-h-11 rounded-full bg-action px-4 font-bold text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">{busy ? 'Aguarde…' : 'Confirmar'}</button>
        </div>
      </form>
    </div>}
  </section>;
}
