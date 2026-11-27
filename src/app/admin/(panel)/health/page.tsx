'use client';
import { useCallback, useEffect, useState } from 'react';
import HealthPanel, { type SystemHealth } from '@/components/platform-admin/HealthPanel';

export default function AdminHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/platform-admin/health', { cache: 'no-store' });
      if (!response.ok) throw Error();
      setHealth(await response.json() as SystemHealth);
    } catch { setError('Não foi possível consultar a saúde do sistema.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  return <section className="space-y-5">
    <div><h1 className="text-3xl font-black">Saúde do sistema</h1><p className="text-muted">Se o sistema está recebendo eventos do Asaas e rodando as tarefas periódicas.</p></div>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {health ? <HealthPanel health={health} /> : loading ? <p>Consultando…</p> : null}
    <button type="button" disabled={loading} onClick={() => void load()} className="min-h-11 rounded-full border border-outline px-4 font-bold disabled:opacity-50">{loading ? 'Consultando…' : 'Atualizar'}</button>
  </section>;
}
