'use client';
import { useEffect, useState } from 'react';

export type Commission = { id: string; restaurantName: string; paymentId: string; kind: string; amountCents: number; createdAt: string };
export type Payout = { id: string; amountCents: number; period: string; status: string; approvedAt: string; paidAt: string | null; canceledAt: string | null; reference: string | null };
const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
const date = (value: string | null) => value ? new Date(value).toLocaleDateString('pt-BR') : '—';
const payoutStatus: Record<string, string> = { approved: 'Aprovado', paid: 'Pago', canceled: 'Cancelado' };

export function AffiliateLedgerView({ commissions, payouts }: { commissions: Commission[]; payouts: Payout[] }) {
 return <div className="grid gap-4 xl:grid-cols-2">
  <section className="rounded-2xl border border-outline bg-white p-5"><h3 className="mb-3 text-lg font-black">Histórico de comissões</h3>{commissions.length === 0 ? <p className="text-sm text-muted">Nenhuma comissão registrada.</p> : <ul className="space-y-2">{commissions.map(item => <li key={item.id} className="rounded-xl border border-outline p-3 text-sm"><div className="flex justify-between gap-2"><strong>{item.kind === 'reversed' ? 'Estorno' : 'Comissão'}</strong><strong>{money(item.amountCents)}</strong></div><p>{item.restaurantName || 'Restaurante'}</p><p className="text-muted">{date(item.createdAt)} · Pagamento {item.paymentId}</p></li>)}</ul>}</section>
  <section className="rounded-2xl border border-outline bg-white p-5"><h3 className="mb-3 text-lg font-black">Histórico de repasses</h3>{payouts.length === 0 ? <p className="text-sm text-muted">Nenhum repasse registrado.</p> : <ul className="space-y-2">{payouts.map(item => <li key={item.id} className="rounded-xl border border-outline p-3 text-sm"><div className="flex justify-between gap-2"><strong>{payoutStatus[item.status] || item.status}</strong><strong>{money(item.amountCents)}</strong></div><p>Período {item.period} · Aprovado em {date(item.approvedAt)}</p>{item.paidAt && <p>Pago em {date(item.paidAt)}</p>}{item.canceledAt && <p>Cancelado em {date(item.canceledAt)}</p>}{item.reference && <p className="break-all text-muted">Referência: {item.reference}</p>}</li>)}</ul>}</section>
 </div>;
}

export default function AffiliateLedger({ affiliateId }: { affiliateId?: string }) {
 const [commissions, setCommissions] = useState<Commission[]>([]), [payouts, setPayouts] = useState<Payout[]>([]);
 const [commissionCursor, setCommissionCursor] = useState<string | null>(null), [payoutCursor, setPayoutCursor] = useState<string | null>(null);
 const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState('');
 async function load(kind: 'initial' | 'commissions' | 'payouts') {
  setBusy(true); setError('');
  try {
   if (affiliateId) {
    const prefix = `/api/platform-admin/affiliates/${encodeURIComponent(affiliateId)}`;
    const requests = kind === 'initial' ? ['commissions', 'payouts'] : [kind];
    for (const resource of requests) {
     const cursor = kind === 'initial' ? null : resource === 'commissions' ? commissionCursor : payoutCursor;
     const response = await fetch(`${prefix}/${resource}?limit=20${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`, { cache: 'no-store' });
     if (!response.ok) throw Error('Não foi possível carregar o histórico.');
     const data = await response.json();
     if (resource === 'commissions') { setCommissions(previous => kind === 'initial' ? data.items : [...previous, ...data.items]); setCommissionCursor(data.nextCursor); }
     else { setPayouts(previous => kind === 'initial' ? data.items : [...previous, ...data.items]); setPayoutCursor(data.nextCursor); }
    }
   } else {
    const params = new URLSearchParams({ limit: '20' });
    if (kind !== 'initial') { const cursor = kind === 'commissions' ? commissionCursor : payoutCursor; if (cursor) params.set(kind === 'commissions' ? 'commissionCursor' : 'payoutCursor', cursor); }
    const response = await fetch(`/api/affiliates/ledger?${params}`, { cache: 'no-store' });
    if (!response.ok) throw Error('Não foi possível carregar o histórico.');
    const data = await response.json();
    if (kind !== 'payouts') { setCommissions(previous => kind === 'initial' ? data.commissions : [...previous, ...data.commissions]); setCommissionCursor(data.nextCommissionCursor); }
    if (kind !== 'commissions') { setPayouts(previous => kind === 'initial' ? data.payouts : [...previous, ...data.payouts]); setPayoutCursor(data.nextPayoutCursor); }
   }
  } catch (caught) { setError(caught instanceof Error ? caught.message : 'Não foi possível carregar o histórico.'); }
  finally { setBusy(false); setLoading(false); }
 }
 // The component remounts when the selected affiliate changes.
 useEffect(() => { void load('initial'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
 return <section className="space-y-3" aria-label="Histórico financeiro">{loading ? <p>Carregando histórico…</p> : <><AffiliateLedgerView commissions={commissions} payouts={payouts}/><div className="flex flex-wrap gap-2">{commissionCursor && <button type="button" disabled={busy} onClick={() => void load('commissions')} className="min-h-11 rounded-full border border-outline px-4 disabled:opacity-50">Mais comissões</button>}{payoutCursor && <button type="button" disabled={busy} onClick={() => void load('payouts')} className="min-h-11 rounded-full border border-outline px-4 disabled:opacity-50">Mais repasses</button>}</div></>}{error && <p role="alert" className="text-red-700">{error}</p>}</section>;
}
