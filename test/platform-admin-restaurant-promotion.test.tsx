// Detalhe do restaurante: promoção aplicada e etapa (F3-T23, passo 5, do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RestaurantPromotion, { promotionStageLines, type RestaurantPromotionData } from '@/components/platform-admin/RestaurantPromotion';

const base = { trialDays: 14, discountPercent: 20, discountMonths: 2, trialEndsAt: null, discountPaid: 0, fullPriceRestoredAt: null };
const lines = (p: Partial<RestaurantPromotionData>) => promotionStageLines({ ...base, stage: 'no_discount', ...p } as RestaurantPromotionData);

describe('etapa da promoção no detalhe', () => {
  it('descreve a promoção e cada etapa', () => {
    expect(lines({ stage: 'trial', trialEndsAt: '2026-12-11T18:00:00.000Z' })).toEqual(['14 dias grátis e 20% de desconto em 2 mensalidades.', 'Em teste grátis até 11/12/2026.']);
    expect(lines({ stage: 'awaiting_payment' })[1]).toBe('Aguardando o primeiro pagamento com desconto.');
    expect(lines({ stage: 'discount', discountPaid: 1 })[1]).toBe('Mensalidades com desconto: 1 de 2 pagas.');
    expect(lines({ stage: 'full_price', discountPaid: 2, fullPriceRestoredAt: '2027-01-27T12:00:00.000Z' })[1]).toBe('Desconto encerrado. Assinatura no preço cheio desde 27/01/2027.');
    expect(lines({ trialDays: 14, discountPercent: 0, discountMonths: 0, stage: 'no_discount' })).toEqual(['14 dias grátis.', 'Sem desconto nas mensalidades.']);
    expect(lines({ trialDays: 0, discountMonths: 1, stage: 'discount', discountPaid: 1 })[0]).toBe('20% de desconto em 1 mensalidade.');
  });
  it('mostra o bloco só quando há promoção', () => {
    expect(renderToStaticMarkup(<RestaurantPromotion promotion={null} />)).toBe('');
    const html = renderToStaticMarkup(<RestaurantPromotion promotion={{ ...base, stage: 'discount', discountPaid: 1 }} />);
    expect(html).toContain('Promoção do afiliado');
    expect(html).toContain('1 de 2 pagas');
  });
  it('o detalhe usa o bloco', () => {
    expect(readFileSync('src/components/platform-admin/RestaurantDetail.tsx', 'utf8')).toContain('<RestaurantPromotion promotion={restaurant.promotion ?? null} />');
  });
});
