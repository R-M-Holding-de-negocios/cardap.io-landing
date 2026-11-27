// Portal do afiliado mostra a promoção vigente dele, só leitura (F3-T23, passo 5, do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { partnerPromotionLines, type SignupPromotion } from '@/lib/signup-promotion';

const plans = [
  { planId: 'basic', fullCents: 5900, discountedCents: 4720 },
  { planId: 'essential', fullCents: 7900, discountedCents: 6320 },
  { planId: 'pro', fullCents: 14900, discountedCents: 11920 },
];
const promo = (over: Partial<SignupPromotion> = {}): SignupPromotion => ({ trialDays: 14, discountPercent: 20, discountMonths: 2, validUntil: '2026-12-31', plans, ...over });
const flat = (lines: string[]) => lines.map(line => line.replace(/ /g, ' '));

describe('promoção no portal do afiliado', () => {
  it('teste grátis, desconto nos planos contratáveis, prazo e a regra da comissão', () => {
    expect(flat(partnerPromotionLines(promo()))).toEqual([
      '14 dias grátis para o restaurante. Um teste grátis por CPF/CNPJ.',
      '20% de desconto nas 2 primeiras mensalidades, no Pix e no cartão:',
      'Básico: R$ 47,20, depois R$ 59,00/mês.',
      'Essencial: R$ 63,20, depois R$ 79,00/mês.',
      'Válida para cadastros até 31/12/2026.',
      'Durante o teste grátis não há comissão. Nas mensalidades com desconto, a comissão é calculada sobre o valor com desconto.',
    ]);
  });
  it('só teste grátis, sem prazo', () => {
    expect(flat(partnerPromotionLines(promo({ discountPercent: 0, discountMonths: 0, validUntil: null })))).toEqual([
      '14 dias grátis para o restaurante. Um teste grátis por CPF/CNPJ.',
      'Durante o teste grátis não há comissão.',
    ]);
  });
  it('só desconto, uma mensalidade', () => {
    expect(flat(partnerPromotionLines(promo({ trialDays: 0, discountMonths: 1, validUntil: null })))).toEqual([
      '20% de desconto na primeira mensalidade, no Pix e no cartão:',
      'Básico: R$ 47,20, depois R$ 59,00/mês.',
      'Essencial: R$ 63,20, depois R$ 79,00/mês.',
      'Nas mensalidades com desconto, a comissão é calculada sobre o valor com desconto.',
    ]);
  });
  it('o portal mostra a promoção ou diz que não há, sem campo para editar', () => {
    const page = readFileSync('src/app/partner/login/page.tsx', 'utf8');
    const card = readFileSync('src/components/partner/PartnerPromotion.tsx', 'utf8');
    expect(page).toContain('<PartnerPromotion promotion={dashboard.promotion??null}/>');
    expect(card).toContain('partnerPromotionLines(promotion)');
    expect(card).toContain('Nenhuma promoção ativa no seu código agora.');
    expect(card).toContain('Quem define a promoção é a equipe cardap.io.');
    expect(card).not.toMatch(/<input|<form|<button/);
  });
});
