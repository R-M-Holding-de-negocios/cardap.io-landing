'use client';
import { useCallback, useEffect, useState } from 'react';
import RestaurantBilling, { type BillingContract, type BillingEvent } from '@/components/platform-admin/RestaurantBilling';
import type { RestaurantRow } from '@/components/platform-admin/RestaurantTable';
import { ATTENTION_CODES, ATTENTION_LABELS } from '@/lib/platform-admin-attention';

type Page<T> = { items: T[]; nextCursor: string | null };
const button = 'min-h-11 rounded-full border border-outline px-4 font-bold disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action';

async function read<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw Error(response.status === 404 ? 'Restaurante não encontrado.' : 'Não foi possível carregar os dados.');
  return await response.json() as T;
}

export default function RestaurantDetail({ id }: { id: string }) {
  const base = `/api/platform-admin/restaurants/${encodeURIComponent(id)}`;
  const [restaurant, setRestaurant] = useState<RestaurantRow | null>(null), [error, setError] = useState('');
  const [contracts, setContracts] = useState<BillingContract[]>([]), [contractCursor, setContractCursor] = useState<string | null>(null);
  const [events, setEvents] = useState<BillingEvent[]>([]), [eventCursor, setEventCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [detail, billing, received] = await Promise.all([
        read<{ restaurant: RestaurantRow }>(base),
        read<Page<BillingContract>>(`${base}/billing?limit=20`),
        read<Page<BillingEvent>>(`${base}/billing-events?limit=20`),
      ]);
      setRestaurant(detail.restaurant);
      setContracts(billing.items); setContractCursor(billing.nextCursor);
      setEvents(received.items); setEventCursor(received.nextCursor);
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível carregar os dados.'); }
    finally { setLoading(false); }
  }, [base]);
  useEffect(() => { void load(); }, [load]);

  async function more(kind: 'contracts' | 'events') {
    try {
      if (kind === 'contracts' && contractCursor) {
        const next = await read<Page<BillingContract>>(`${base}/billing?limit=20&cursor=${encodeURIComponent(contractCursor)}`);
        setContracts(current => [...current, ...next.items]); setContractCursor(next.nextCursor);
      }
      if (kind === 'events' && eventCursor) {
        const next = await read<Page<BillingEvent>>(`${base}/billing-events?limit=20&cursor=${encodeURIComponent(eventCursor)}`);
        setEvents(current => [...current, ...next.items]); setEventCursor(next.nextCursor);
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível carregar os dados.'); }
  }

  const marks = ATTENTION_CODES.filter(code => restaurant?.attention?.includes(code));
  return <section className="space-y-5">
    <p><a href="/admin/restaurants" className="font-bold text-action underline">Voltar para restaurantes</a></p>
    <div>
      <h1 className="text-3xl font-black">{restaurant?.name || (loading ? 'Carregando…' : 'Restaurante')}</h1>
      <p className="break-all text-sm text-muted">{id}</p>
    </div>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {restaurant && <dl className="grid gap-4 rounded-2xl border border-outline bg-white p-5 text-sm sm:grid-cols-2 xl:grid-cols-4">
      <div><dt className="font-bold text-muted">Assinatura</dt><dd>{restaurant.subscriptionStatus || '—'}</dd></div>
      <div><dt className="font-bold text-muted">Plano</dt><dd>{restaurant.subscriptionPlan || '—'}</dd></div>
      <div><dt className="font-bold text-muted">Acesso</dt><dd>{restaurant.accessStatus === 'suspended' ? 'Suspenso' : 'Ativo'}</dd></div>
      <div><dt className="font-bold text-muted">Indicação</dt><dd>{restaurant.affiliate || '—'}</dd></div>
    </dl>}
    {marks.map(code => <p key={code} role="note" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-900"><strong>{ATTENTION_LABELS[code].label}.</strong> {ATTENTION_LABELS[code].help}</p>)}
    {!loading && !error && <>
      <RestaurantBilling contracts={contracts} events={events} />
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={!contractCursor} onClick={() => void more('contracts')} className={button}>Mais contratos</button>
        <button type="button" disabled={!eventCursor} onClick={() => void more('events')} className={button}>Mais eventos</button>
        <button type="button" onClick={() => void load()} className={button}>Atualizar</button>
      </div>
    </>}
  </section>;
}
