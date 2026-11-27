// Indicadores de receita na visão geral do painel (tarefa F3-T18 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RevenueMetrics, { type RevenueMetricsData } from '@/components/platform-admin/RevenueMetrics';
import { platformAdminPathAllowed } from '@/lib/platform-admin-paths';

const data: RevenueMetricsData = {
  accounts: { active: 12, pendingPayment: 3, overdue: 2, canceled: 1 }, contractedMonthlyCents: 82800,
  activated: { last7Days: 4, last30Days: 9 }, canceled: { last7Days: 0, last30Days: 1 },
};

describe('indicadores de receita no painel', () => {
  it('a lista fechada do site aceita a rota e recusa vizinhos', () => {
    expect(platformAdminPathAllowed('GET', ['metrics'])).toBe(true);
    expect(platformAdminPathAllowed('POST', ['metrics'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['metrics', 'revenue'])).toBe(false);
  });

  it('mostra cada número com o valor em reais formatado', () => {
    const html = renderToStaticMarkup(<RevenueMetrics data={data} />);
    for (const text of ['Contas ativas', 'Aguardando pagamento', 'Inadimplentes', 'Canceladas', 'Receita mensal contratada', 'Novas contas', 'Cancelamentos']) expect(html).toContain(text);
    expect(html.replace(/ /g, ' ')).toContain('R$ 828,00');
    expect(html).toContain('4 em 7 dias');
    expect(html).toContain('9 em 30 dias');
  });

  it('cada número traz a regra de cálculo, e a receita avisa que não é dinheiro recebido', () => {
    const html = renderToStaticMarkup(<RevenueMetrics data={data} />);
    expect(html).toContain('Não é dinheiro recebido');
    expect(html).toContain('antes das taxas do Asaas');
    expect(html).toContain('primeiro pagamento confirmado');
    expect(html).toContain('contrato mais recente está cancelado');
    // 8 desde a contagem de contas em teste grátis (F3-T23, passo 5).
    expect(html.split('<p class="mt-2 text-xs text-muted">').length - 1).toBe(8);
  });

  it('a visão geral consulta a rota e mostra o bloco', () => {
    const page = readFileSync('src/app/admin/(panel)/page.tsx', 'utf8');
    expect(page).toContain('/api/platform-admin/metrics');
    expect(page).toContain('<RevenueMetrics data={metrics}');
  });
});
