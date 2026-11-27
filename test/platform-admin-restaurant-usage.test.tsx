// Uso por restaurante no detalhe do painel do administrador (tarefa F3-T19 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RestaurantUsage from '@/components/platform-admin/RestaurantUsage';

describe('uso por restaurante no painel', () => {
  it('mostra as contagens e a data do último login', () => {
    const html = renderToStaticMarkup(<RestaurantUsage usage={{ tables: 12, menuItems: 48, staff: 5, ordersLast7Days: 73, lastAccessAt: Date.parse('2026-11-26T21:00:00.000Z') }} />);
    for (const text of ['Mesas', '12', 'Pratos', '48', 'Equipe', '5', 'Pedidos nos últimos 7 dias', '73', 'Último login de dono ou gerente', '26/11/2026']) expect(html).toContain(text);
  });

  it('restaurante sem login registrado diz isso, sem inventar data', () => {
    const html = renderToStaticMarkup(<RestaurantUsage usage={{ tables: 0, menuItems: 0, staff: 0, ordersLast7Days: 0, lastAccessAt: null }} />);
    expect(html).toContain('Nenhum login registrado');
    expect(html).toContain('26/11/2026');
  });

  it('API antiga, sem o campo, não mostra o bloco', () => {
    expect(renderToStaticMarkup(<RestaurantUsage usage={undefined} />)).toBe('');
  });

  it('o detalhe do restaurante usa o bloco', () => {
    expect(readFileSync('src/components/platform-admin/RestaurantDetail.tsx', 'utf8')).toContain('<RestaurantUsage usage={restaurant.usage}');
  });
});
