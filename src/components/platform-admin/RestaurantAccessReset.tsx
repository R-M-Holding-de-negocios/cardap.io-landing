'use client';
// Redefinição de senha de emergência (F3-T9 do repositório Anfc-Cardapios): o admin gera um link
// de uso único para o dono ou um gerente. O link aparece uma vez e o sistema não o envia a ninguém.
import { useEffect, useState } from 'react';
import { accessResetLink } from '@/lib/access-reset';

type User = { id: string; name: string; role: 'OWNER' | 'MANAGER' };
const ROLE: Record<User['role'], string> = { OWNER: 'Dono', MANAGER: 'Gerente' };
const button = 'min-h-11 rounded-full border border-outline px-4 font-bold text-action disabled:opacity-60';

export function AccessResetLink({ link, name }: { link: string; name: string }) {
  return <div role="status" className="space-y-2 rounded-xl bg-peach p-3 text-sm">
    <p><strong>Link para {name}:</strong> vale uma vez e por 15 minutos. Ele não aparece de novo: copie agora e mande por um canal confirmado com a pessoa.</p>
    <p className="break-all font-mono text-xs">{link}</p>
  </div>;
}

export default function RestaurantAccessReset({ id, suspended }: { id: string; suspended: boolean }) {
  const base = `/api/platform-admin/restaurants/${encodeURIComponent(id)}`;
  const [users, setUsers] = useState<User[] | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [reason, setReason] = useState('');
  const [result, setResult] = useState<{ link: string; name: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    fetch(`${base}/users`, { cache: 'no-store' })
      .then(async response => { const data = await response.json(); if (!response.ok) throw Error(data.error || 'Não foi possível carregar os usuários.'); if (alive) setUsers(data.items); })
      .catch(e => { if (alive) setError(e instanceof Error ? e.message : 'Não foi possível carregar os usuários.'); });
    return () => { alive = false; };
  }, [base]);

  async function issue(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setBusy(true); setError(''); setResult(null);
    try {
      const response = await fetch(`${base}/users/${encodeURIComponent(selected.id)}/access-reset`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reason }) });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Não foi possível gerar o link.');
      const link = accessResetLink(String(data.token));
      if (!link) throw Error('Resposta inesperada do servidor.');
      setResult({ link, name: selected.name }); setReason(''); setSelected(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível gerar o link.'); }
    finally { setBusy(false); }
  }

  return <section className="space-y-3 rounded-2xl border border-outline bg-white p-5">
    <h2 className="text-lg font-black">Acesso do restaurante</h2>
    <p className="text-sm text-muted">Para quem esqueceu a senha. Gerar um novo link cancela o anterior; usar o link encerra todas as sessões da pessoa. Quem tem autenticador continua precisando dele. A equipe (garçons) usa PIN, que o dono troca no painel.</p>
    {suspended && <p role="note" className="text-sm font-bold">Restaurante suspenso: reative o acesso antes de gerar um link.</p>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    {result && <AccessResetLink link={result.link} name={result.name} />}
    {users === null && !error && <p className="text-sm text-muted" role="status">Carregando usuários…</p>}
    {users && users.length === 0 && <p className="text-sm text-muted">Nenhum dono ou gerente ativo.</p>}
    {users && users.length > 0 && <ul className="space-y-2">
      {users.map(user => <li key={user.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span><strong>{user.name}</strong> · {ROLE[user.role]}</span>
        <button type="button" disabled={busy || suspended} onClick={() => { setSelected(user); setResult(null); setError(''); }} className={button}>Gerar link de nova senha</button>
      </li>)}
    </ul>}
    {selected && <form onSubmit={issue} className="space-y-2">
      <label className="block text-sm font-bold">Motivo (fica na auditoria) — link para {selected.name}
        <input required minLength={3} maxLength={500} value={reason} onChange={e => setReason(e.target.value)} className="mt-1 w-full rounded-xl border border-outline px-3 py-2 font-normal" />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className={button}>{busy ? 'Gerando…' : 'Gerar link'}</button>
        <button type="button" disabled={busy} onClick={() => setSelected(null)} className={button}>Cancelar</button>
      </div>
    </form>}
  </section>;
}
