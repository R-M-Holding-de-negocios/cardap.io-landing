import { ATTENTION_CODES, ATTENTION_LABELS, type AttentionCode } from '@/lib/platform-admin-attention';

export type AttentionItem = { id: string; name: string | null; since: string | null };
export type AttentionData = {
  counts: Record<AttentionCode | 'open_tickets' | 'payouts_due' | 'payouts_awaiting_transfer', number>;
  items: Record<AttentionCode, AttentionItem[]>;
};

const linkClass = 'font-bold text-action underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action';
const when = (iso: string | null) => {
  const time = iso ? Date.parse(iso) : Number.NaN;
  return Number.isNaN(time) ? '' : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(time);
};

export default function AttentionQueue({ data }: { data: AttentionData }) {
  const billing = ATTENTION_CODES.filter(code => data.counts[code] > 0);
  const others = [
    { count: data.counts.open_tickets, label: 'Chamados abertos', href: '/admin/support' },
    { count: data.counts.payouts_due, label: 'Repasses a aprovar', href: '/admin/payouts' },
    { count: data.counts.payouts_awaiting_transfer, label: 'Repasses aprovados aguardando Pix', href: '/admin/payouts' },
  ].filter(item => item.count > 0);

  if (billing.length === 0 && others.length === 0) {
    return <p className="rounded-2xl border border-outline bg-white p-5 font-bold">Nada precisa de atenção agora.</p>;
  }
  return <div className="space-y-4">
    {billing.map(code => <article key={code} className="rounded-2xl border border-red-300 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-black">{ATTENTION_LABELS[code].label} <span className="ml-1 rounded-full bg-red-50 px-2 py-0.5 text-sm text-red-800">{data.counts[code]}</span></h3>
        <a href={`/admin/restaurants?attention=${code}`} className={linkClass}>Ver todos</a>
      </div>
      <p className="mt-1 text-sm text-muted">{ATTENTION_LABELS[code].help}</p>
      <ul className="mt-3 divide-y divide-outline">
        {data.items[code].map(item => <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
          <a href={`/admin/restaurants?query=${encodeURIComponent(item.id)}`} className={linkClass}>{item.name || 'Sem nome'}</a>
          <span className="text-xs text-muted">{when(item.since)}</span>
        </li>)}
      </ul>
      {data.counts[code] > data.items[code].length && <p className="mt-2 text-xs text-muted">Mostrando os {data.items[code].length} mais antigos.</p>}
    </article>)}
    {others.length > 0 && <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {others.map(item => <li key={item.label} className="rounded-2xl border border-outline bg-white p-5">
        <a href={item.href} className={linkClass}>{item.label}</a>
        <p className="mt-2 text-3xl font-black">{item.count}</p>
      </li>)}
    </ul>}
  </div>;
}
