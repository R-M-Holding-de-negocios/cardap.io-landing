// Contato do dono na lista e no detalhe de restaurantes do painel do administrador
// (decisão do João em 26/11/2026; tarefa F3-T17 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RestaurantTable, { type RestaurantRow } from '@/components/platform-admin/RestaurantTable';

const row = (overrides: Partial<RestaurantRow>): RestaurantRow => ({
  id: 'rest-1', name: 'Bistrô', subscriptionStatus: 'active', subscriptionPlan: 'basic_v1', accessStatus: 'active',
  affiliate: null, userCount: 1, supportCount: 0, createdAt: '2026-11-25T00:00:00.000Z', billingAttention: null, ...overrides,
});

describe('contato do dono no painel', () => {
  it('a lista mostra nome, e-mail e telefone do responsável', () => {
    const html = renderToStaticMarkup(<RestaurantTable items={[row({ ownerName: 'Dona Maria', ownerEmail: 'dona@example.com', ownerPhone: '+5511988887777' })]} onAction={() => {}} />);
    expect(html).toContain('Responsável');
    expect(html).toContain('Dona Maria');
    expect(html).toContain('href="mailto:dona@example.com"');
    expect(html).toContain('+5511988887777');
  });

  it('restaurante sem contato cadastrado, ou linha antiga sem os campos, mostra um traço', () => {
    const html = renderToStaticMarkup(<RestaurantTable items={[row({ ownerName: null, ownerEmail: null, ownerPhone: null }), row({ id: 'rest-2' })]} onAction={() => {}} />);
    expect(html).not.toContain('mailto:');
    expect(html.split('Sem contato cadastrado')).toHaveLength(3);
  });

  it('o detalhe do restaurante mostra os mesmos três dados', () => {
    const source = readFileSync('src/components/platform-admin/RestaurantDetail.tsx', 'utf8');
    for (const field of ['ownerName', 'ownerEmail', 'ownerPhone']) expect(source).toContain(`restaurant.${field}`);
    expect(source).toContain('Responsável');
  });
});
