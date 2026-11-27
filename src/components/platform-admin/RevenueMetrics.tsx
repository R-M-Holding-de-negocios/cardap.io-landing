import { money } from '@/lib/platform-admin-billing';

type Period = { last7Days: number; last30Days: number };
export type RevenueMetricsData = {
  accounts: { active: number; trialing?: number; pendingPayment: number; overdue: number; canceled: number };
  contractedMonthlyCents: number; activated: Period; canceled: Period;
};

const period = (value: Period) => `${value.last7Days} em 7 dias · ${value.last30Days} em 30 dias`;

// Indicadores de receita (F3-T18). Cada número traz a regra de cálculo; nada aqui é estimativa.
export default function RevenueMetrics({ data }: { data: RevenueMetricsData }) {
  const cards: [string, string, string][] = [
    ['Contas ativas', String(data.accounts.active), 'Restaurantes com a conta liberada (pagamento confirmado).'],
    ['Em teste grátis', String(data.accounts.trialing ?? 0), 'Restaurantes no teste grátis da promoção de um afiliado. Ainda não pagam e não entram na receita.'],
    ['Aguardando pagamento', String(data.accounts.pendingPayment), 'Restaurantes cadastrados que ainda não tiveram o pagamento confirmado. Não inclui os cancelados.'],
    ['Inadimplentes', String(data.accounts.overdue), 'Restaurantes com cobrança vencida e não paga.'],
    ['Canceladas', String(data.accounts.canceled), 'Restaurantes sem conta ativa cujo contrato mais recente está cancelado.'],
    ['Receita mensal contratada', money(data.contractedMonthlyCents), 'Soma do valor vigente dos contratos ativos, um por restaurante, com o desconto da promoção enquanto ele durar. Não é dinheiro recebido: é o valor contratado, antes das taxas do Asaas.'],
    ['Novas contas', period(data.activated), 'Contratos que tiveram o primeiro pagamento confirmado no período. Renovação não conta. Pagamentos anteriores a 25/11/2026 não entram.'],
    ['Cancelamentos', period(data.canceled), 'Contratos que passaram a cancelado no período.'],
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([title, value, rule]) => <article key={title} className="rounded-2xl border border-outline bg-white p-5">
    <h3 className="text-sm font-bold text-muted">{title}</h3>
    <p className="mt-2 text-3xl font-black">{value}</p>
    <p className="mt-2 text-xs text-muted">{rule}</p>
  </article>)}</div>;
}
