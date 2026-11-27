// Fila de atenção: assinatura que não voltou ao preço cheio (F3-T23, passo 5, do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AttentionQueue from '@/components/platform-admin/AttentionQueue';
import { ATTENTION_LABELS, isAttentionCode } from '@/lib/platform-admin-attention';

describe('fila de atenção: preço cheio', () => {
  it('o código novo é conhecido, com nome e explicação', () => {
    expect(isAttentionCode('price_not_restored')).toBe(true);
    expect(ATTENTION_LABELS.price_not_restored.label).toBe('Não voltou ao preço cheio');
    expect(ATTENTION_LABELS.price_not_restored.help).toContain('mensalidades com desconto');
  });
  it('aparece na fila com o restaurante', () => {
    const data = {
      counts: { charge_failed: 0, missing_subscription: 0, overdue: 0, stalled_signup: 0, price_not_restored: 1, open_tickets: 0, payouts_due: 0, payouts_awaiting_transfer: 0 },
      items: { charge_failed: [], missing_subscription: [], overdue: [], stalled_signup: [], price_not_restored: [{ id: 'rest-1', name: 'Cantina', since: '2026-11-27T10:00:00.000Z' }] },
    };
    const html = renderToStaticMarkup(<AttentionQueue data={data as never} />);
    expect(html).toContain('Não voltou ao preço cheio');
    expect(html).toContain('Cantina');
  });
  it('a lista de restaurantes oferece o filtro', () => {
    expect(readFileSync('src/app/admin/(panel)/restaurants/page.tsx', 'utf8')).toContain('value="price_not_restored"');
  });
});
