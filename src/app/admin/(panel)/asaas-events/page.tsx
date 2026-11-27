'use client';
import { useCallback, useEffect, useState } from 'react';
import AsaasEventsTable, { type AsaasEvent } from '@/components/platform-admin/AsaasEventsTable';

const field = 'mt-1 block min-h-11 rounded-xl border border-outline bg-white px-3';
const pager = 'min-h-11 rounded-full border border-outline px-4 disabled:opacity-50';

export default function AdminAsaasEvents() {
  const [items, setItems] = useState<AsaasEvent[]>([]), [status, setStatus] = useState(''), [from, setFrom] = useState(''), [to, setTo] = useState('');
  const [cursor, setCursor] = useState(''), [nextCursor, setNextCursor] = useState<string | null>(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ limit: '50', ...(status ? { status } : {}), ...(from ? { from } : {}), ...(to ? { to } : {}), ...(cursor ? { cursor } : {}) });
      const response = await fetch(`/api/platform-admin/asaas-events?${params}`, { cache: 'no-store' });
      if (!response.ok) throw Error(response.status === 400 ? 'Período inválido: a data inicial não pode ser depois da final.' : 'Não foi possível carregar os eventos.');
      const data = await response.json() as { items: AsaasEvent[]; nextCursor: string | null };
      setItems(data.items); setNextCursor(data.nextCursor);
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível carregar os eventos.'); }
    finally { setLoading(false); }
  }, [status, from, to, cursor]);
  useEffect(() => { void load(); }, [load]);
  return <section className="space-y-5">
    <div><h1 className="text-3xl font-black">Eventos do Asaas</h1><p className="text-muted">Tudo o que o Asaas enviou e o que o sistema fez com cada evento. Datas no horário de Brasília.</p></div>
    <div className="flex flex-wrap gap-3">
      <label className="text-sm font-bold">Tratamento<select value={status} onChange={e => { setStatus(e.target.value); setCursor(''); }} className={field}><option value="">Todos</option><option value="processed">Processado</option><option value="ignored">Ignorado</option><option value="processing">Em processamento</option></select></label>
      <label className="text-sm font-bold">De<input type="date" value={from} onChange={e => { setFrom(e.target.value); setCursor(''); }} className={field} /></label>
      <label className="text-sm font-bold">Até<input type="date" value={to} onChange={e => { setTo(e.target.value); setCursor(''); }} className={field} /></label>
    </div>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {loading ? <p>Carregando eventos…</p> : <AsaasEventsTable items={items} />}
    <div className="flex gap-3">
      <button type="button" disabled={!cursor} onClick={() => setCursor('')} className={pager}>Início</button>
      <button type="button" disabled={!nextCursor} onClick={() => setCursor(nextCursor || '')} className={pager}>Próxima página</button>
      <button type="button" onClick={() => void load()} className={pager}>Atualizar</button>
    </div>
  </section>;
}
