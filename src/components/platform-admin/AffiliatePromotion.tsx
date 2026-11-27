'use client';
import { useState } from 'react';

export type AffiliatePromotionData = { active: boolean; trialDays: number; discountPercent: number; discountMonths: number; validUntil: string | null };
// Limites técnicos da API (worker/src/affiliate-promotion.ts). Os valores são escolhidos por afiliado.
export const PROMOTION_LIMITS = { trialDays: 365, discountPercent: 90, discountMonths: 24 } as const;

/** Resumo em uma frase, como o cliente vai ler. */
export function promotionSummary(promotion: AffiliatePromotionData | null): string {
  if (!promotion) return 'Nenhuma promoção configurada.';
  const parts = [
    ...(promotion.trialDays > 0 ? [`${promotion.trialDays} ${promotion.trialDays === 1 ? 'dia' : 'dias'} de teste grátis`] : []),
    ...(promotion.discountPercent > 0 ? [`${promotion.discountPercent}% de desconto ${promotion.discountMonths === 1 ? 'na primeira mensalidade' : `nas ${promotion.discountMonths} primeiras mensalidades`}`] : []),
  ];
  if (parts.length === 0) return 'Promoção sem benefício definido.';
  const until = promotion.validUntil ? `, para cadastros até ${promotion.validUntil.split('-').reverse().join('/')}` : '';
  return `${promotion.active ? 'Ativa' : 'Desligada'}: ${parts.join(' e ')}${until}.`;
}

const field = 'mt-1 block min-h-11 w-full rounded-xl border border-outline p-3';

// Promoção por afiliado (F3-T23). Quem se cadastra pelo código deste afiliado recebe a promoção;
// mudar aqui não altera quem já se cadastrou.
export default function AffiliatePromotion({ affiliateId, status, promotion, onSaved }: { affiliateId: string; status: string; promotion: AffiliatePromotionData | null; onSaved: () => void }) {
  const [active, setActive] = useState(promotion?.active ?? false), [trialDays, setTrialDays] = useState(String(promotion?.trialDays ?? 0));
  const [discountPercent, setDiscountPercent] = useState(String(promotion?.discountPercent ?? 0)), [discountMonths, setDiscountMonths] = useState(String(promotion?.discountMonths ?? 0));
  const [validUntil, setValidUntil] = useState(promotion?.validUntil ?? ''), [reason, setReason] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState(''), [saved, setSaved] = useState(false);
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setSaved(false);
    try {
      const response = await fetch(`/api/platform-admin/affiliates/${encodeURIComponent(affiliateId)}/promotion`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ active, trialDays: Number(trialDays), discountPercent: Number(discountPercent), discountMonths: Number(discountMonths), validUntil: validUntil || null, reason }) });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Promoção não salva.');
      setReason(''); setSaved(true); onSaved();
    } catch (e) { setError(e instanceof Error ? e.message : 'Promoção não salva.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={save} className="space-y-3 rounded-xl border border-outline p-4">
    <h3 className="font-black">Promoção</h3>
    <p className="text-sm">{promotionSummary(promotion)}</p>
    <p className="text-sm text-muted">Vale para quem se cadastrar pelo código deste afiliado. Mudar ou desligar não altera quem já se cadastrou.</p>
    {status !== 'approved' && <p role="note" className="text-sm text-muted">Só afiliado aprovado pode ter promoção ativa.</p>}
    <label className="flex min-h-11 items-center gap-2 text-sm font-bold"><input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="h-5 w-5" />Promoção ativa</label>
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-bold">Dias de teste grátis<input type="number" min={0} max={PROMOTION_LIMITS.trialDays} step={1} required value={trialDays} onChange={e => setTrialDays(e.target.value)} className={field} /><span className="font-normal text-muted">0 para não dar teste.</span></label>
      <label className="text-sm font-bold">Válida para cadastros até<input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} className={field} /><span className="font-normal text-muted">Em branco: sem data final.</span></label>
      <label className="text-sm font-bold">Desconto (%)<input type="number" min={0} max={PROMOTION_LIMITS.discountPercent} step={1} required value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} className={field} /><span className="font-normal text-muted">0 para não dar desconto. Máximo {PROMOTION_LIMITS.discountPercent}%.</span></label>
      <label className="text-sm font-bold">Mensalidades com desconto<input type="number" min={0} max={PROMOTION_LIMITS.discountMonths} step={1} required value={discountMonths} onChange={e => setDiscountMonths(e.target.value)} className={field} /><span className="font-normal text-muted">Quantas das primeiras mensalidades têm o desconto.</span></label>
    </div>
    <label className="block text-sm font-bold">Motivo<textarea required minLength={3} maxLength={500} value={reason} onChange={e => setReason(e.target.value)} className="mt-1 block w-full rounded-xl border border-outline p-3" /></label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    {saved && <p role="status" className="text-sm font-bold">Promoção salva.</p>}
    <button disabled={busy} className="min-h-11 rounded-full bg-action px-4 font-bold text-white disabled:opacity-50">{busy ? 'Salvando…' : 'Salvar promoção'}</button>
  </form>;
}
