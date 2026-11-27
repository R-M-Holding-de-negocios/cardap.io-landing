// Indicadores com a promoção por afiliado (F3-T23, passo 5, do repositório Anfc-Cardapios).
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RevenueMetrics, { type RevenueMetricsData } from '@/components/platform-admin/RevenueMetrics';

const data: RevenueMetricsData = {
  accounts: { active: 12, trialing: 5, pendingPayment: 3, overdue: 2, canceled: 1 }, contractedMonthlyCents: 82800,
  activated: { last7Days: 4, last30Days: 9 }, canceled: { last7Days: 0, last30Days: 1 },
};

describe('indicadores com promoção', () => {
  it('mostra as contas em teste grátis, com a regra', () => {
    const html = renderToStaticMarkup(<RevenueMetrics data={data} />);
    expect(html).toMatch(/Em teste grátis<\/h3><p class="mt-2 text-3xl font-black">5<\/p>/);
    expect(html).toContain('Ainda não pagam');
  });
  it('a receita diz que soma o valor vigente, com o desconto da promoção enquanto durar', () => {
    const html = renderToStaticMarkup(<RevenueMetrics data={data} />);
    expect(html).toContain('valor vigente');
    expect(html).toContain('com o desconto da promoção enquanto ele durar');
  });
  it('resposta antiga, sem a contagem de teste, mostra 0', () => {
    const { trialing: _ignored, ...accounts } = data.accounts;
    const html = renderToStaticMarkup(<RevenueMetrics data={{ ...data, accounts } as RevenueMetricsData} />);
    expect(html).toMatch(/Em teste grátis<\/h3><p class="mt-2 text-3xl font-black">0<\/p>/);
  });
});
