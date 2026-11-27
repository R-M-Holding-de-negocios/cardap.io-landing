import { dateTime } from '@/lib/platform-admin-billing';

export type RestaurantUsageData = { tables: number; menuItems: number; staff: number; ordersLast7Days: number; lastAccessAt: number | null };

// Uso por restaurante, para orientar o atendimento (F3-T19). Só contagens e datas: nenhum
// conteúdo de pedido, nome de cliente ou valor.
export default function RestaurantUsage({ usage }: { usage: RestaurantUsageData | undefined }) {
  if (!usage) return null;
  const entries: [string, string | number][] = [
    ['Mesas', usage.tables], ['Pratos', usage.menuItems], ['Equipe', usage.staff], ['Pedidos nos últimos 7 dias', usage.ordersLast7Days],
    ['Último login de dono ou gerente', usage.lastAccessAt === null ? 'Nenhum login registrado' : dateTime(usage.lastAccessAt)],
  ];
  return <section aria-labelledby="usage-title" className="space-y-3">
    <h2 id="usage-title" className="text-xl font-black">Uso do sistema</h2>
    <dl className="grid gap-4 rounded-2xl border border-outline bg-white p-5 text-sm sm:grid-cols-2 xl:grid-cols-5">
      {entries.map(([name, value]) => <div key={name}><dt className="font-bold text-muted">{name}</dt><dd className="text-lg font-bold">{value}</dd></div>)}
    </dl>
    <p className="text-xs text-muted">O login passou a ser registrado em 26/11/2026; acessos anteriores não aparecem.</p>
  </section>;
}
