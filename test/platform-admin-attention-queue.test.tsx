// Fila "precisa de atenção" na visão geral do painel do administrador
// (tarefa F3-T15 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AttentionQueue, { type AttentionData } from '@/components/platform-admin/AttentionQueue';
import RestaurantTable, { type RestaurantRow } from '@/components/platform-admin/RestaurantTable';
import { platformAdminPathAllowed } from '@/lib/platform-admin-paths';

const empty: AttentionData = {
  counts: { charge_failed: 0, missing_subscription: 0, overdue: 0, stalled_signup: 0, price_not_restored: 0, open_tickets: 0, payouts_due: 0, payouts_awaiting_transfer: 0 },
  items: { charge_failed: [], missing_subscription: [], overdue: [], stalled_signup: [], price_not_restored: [] },
};
const row = (overrides: Partial<RestaurantRow>): RestaurantRow => ({
  id: 'rest-1', name: 'Bistrô', subscriptionStatus: 'active', subscriptionPlan: 'basic_v1', accessStatus: 'active',
  affiliate: null, userCount: 1, supportCount: 0, createdAt: '2026-11-25T00:00:00.000Z', billingAttention: null, attention: [], ...overrides,
});

describe('fila de atenção', () => {
  it('sem pendência, diz que nada precisa de atenção', () => {
    const html = renderToStaticMarkup(<AttentionQueue data={empty} />);
    expect(html).toContain('Nada precisa de atenção agora');
    expect(html).not.toContain('Cobrança não criada');
  });

  it('mostra cada condição com contagem, restaurantes e atalho para a lista filtrada', () => {
    const data: AttentionData = {
      counts: { ...empty.counts, charge_failed: 2, stalled_signup: 1, open_tickets: 3, payouts_due: 1 },
      items: { ...empty.items, charge_failed: [{ id: 'rest a/1', name: 'Cantina', since: '2026-11-25T10:00:00.000Z' }, { id: 'rest-2', name: null, since: null }], stalled_signup: [{ id: 'rest-3', name: 'Padaria', since: '2026-11-20T10:00:00.000Z' }] },
    };
    const html = renderToStaticMarkup(<AttentionQueue data={data} />);
    expect(html).not.toContain('Nada precisa de atenção agora');
    expect(html).toContain('Cobrança não criada');
    expect(html).toContain('Cantina');
    expect(html).toContain('Sem nome');
    expect(html).toContain('href="/admin/restaurants?attention=charge_failed"');
    expect(html).toContain('href="/admin/restaurants?query=rest%20a%2F1"');
    expect(html).toContain('Cadastro parado');
    expect(html).toContain('href="/admin/support"');
    expect(html).toContain('href="/admin/payouts"');
    // Condição zerada não aparece.
    expect(html).not.toContain('Inadimplente');
    expect(html).not.toContain('Sem assinatura no Asaas');
  });

  it('a lista de restaurantes mostra uma marca por condição', () => {
    const html = renderToStaticMarkup(<RestaurantTable items={[row({ attention: ['charge_failed', 'stalled_signup'] }), row({ id: 'b' })]} onAction={() => {}} />);
    expect(html.split('Cobrança não criada')).toHaveLength(2);
    expect(html.split('Cadastro parado')).toHaveLength(2);
    expect(html).not.toContain('Inadimplente');
  });

  it('o site repassa a consulta da fila e recusa caminhos vizinhos', () => {
    expect(platformAdminPathAllowed('GET', ['attention'])).toBe(true);
    expect(platformAdminPathAllowed('POST', ['attention'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['attention', 'x'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['attentions'])).toBe(false);
  });

  it('a tela de restaurantes oferece os quatro filtros e aceita o filtro vindo do endereço', () => {
    const source = readFileSync('src/app/admin/(panel)/restaurants/page.tsx', 'utf8');
    for (const code of ['charge_failed', 'missing_subscription', 'overdue', 'stalled_signup']) expect(source).toContain(`value="${code}"`);
    expect(source).toContain('window.location.search');
  });

  it('a visão geral consulta a fila', () => {
    expect(readFileSync('src/app/admin/(panel)/page.tsx', 'utf8')).toContain('/api/platform-admin/attention');
  });
});
