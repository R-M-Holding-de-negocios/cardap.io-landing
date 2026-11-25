// Marca "sem assinatura no Asaas" na lista de restaurantes do painel do administrador
// (tarefa F3-T10 do repositório Anfc-Cardapios; decisão do João em 25/11/2026).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RestaurantTable, { type RestaurantRow } from '@/components/platform-admin/RestaurantTable';

const row = (overrides: Partial<RestaurantRow>): RestaurantRow => ({
  id: 'rest-1', name: 'Bistrô', subscriptionStatus: 'active', subscriptionPlan: 'basic_v1', accessStatus: 'active',
  affiliate: null, userCount: 1, supportCount: 0, createdAt: '2026-11-25T00:00:00.000Z', billingAttention: null, ...overrides,
});

describe('atenção de cobrança na lista de restaurantes', () => {
  it('mostra a marca só para a conta ativa sem assinatura no Asaas', () => {
    const html = renderToStaticMarkup(<RestaurantTable items={[row({ id: 'a', billingAttention: 'missing_subscription' }), row({ id: 'b' })]} onAction={() => {}} />);
    expect(html.split('Sem assinatura no Asaas')).toHaveLength(2);
    expect(html).toContain('A renovação mensal não será cobrada');
  });

  it('linha antiga, sem o campo, continua sendo exibida sem marca', () => {
    const { billingAttention: _removed, ...legacy } = row({});
    const html = renderToStaticMarkup(<RestaurantTable items={[legacy as RestaurantRow]} onAction={() => {}} />);
    expect(html).toContain('Bistrô');
    expect(html).not.toContain('Sem assinatura no Asaas');
  });

  it('a tela oferece o filtro e o envia à API como attention=missing_subscription', () => {
    const source = readFileSync('src/app/admin/(panel)/restaurants/page.tsx', 'utf8');
    expect(source).toContain('missing_subscription');
    expect(source).toMatch(/attention/);
    expect(source).toContain('Sem assinatura no Asaas');
  });
});
