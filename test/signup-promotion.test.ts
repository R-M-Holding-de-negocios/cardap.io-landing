// Promoção mostrada no cadastro antes de confirmar (F3-T23, passo 5, do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { promotionSummary, type SignupPromotion } from '@/lib/signup-promotion';

const plans = [
  { planId: 'basic', fullCents: 5900, discountedCents: 4720 },
  { planId: 'essential', fullCents: 7900, discountedCents: 6320 },
  { planId: 'pro', fullCents: 14900, discountedCents: 11920 },
];
const promo = (over: Partial<SignupPromotion> = {}): SignupPromotion => ({ trialDays: 14, discountPercent: 20, discountMonths: 2, validUntil: null, plans, ...over });
const text = (lines: string[]) => lines.join(' ').replace(/ /g, ' ');

describe('promoção no cadastro', () => {
  it('teste grátis e desconto no Pix, com o preço de cada fase e o preço cheio depois', () => {
    const summary = promotionSummary(promo(), 'essential', 'PIX')!;
    expect(summary.title).toBe('Promoção aplicada pelo código');
    expect(text(summary.lines)).toBe('14 dias grátis. Nada é cobrado agora. Um teste grátis por CPF/CNPJ. No Pix: R$ 63,20 nas 2 primeiras mensalidades (20% de desconto). Depois, R$ 79,00/mês.');
  });
  it('no cartão avisa que o desconto vale só no Pix', () => {
    expect(text(promotionSummary(promo(), 'basic', 'CREDIT_CARD')!.lines)).toContain('O desconto de 20% nas 2 primeiras mensalidades vale só no Pix. No cartão, R$ 59,00/mês.');
  });
  it('uma mensalidade, sem teste grátis e com prazo de validade', () => {
    const lines = text(promotionSummary(promo({ trialDays: 0, discountMonths: 1, validUntil: '2026-12-31' }), 'basic', 'PIX')!.lines);
    expect(lines).toBe('No Pix: R$ 47,20 na primeira mensalidade (20% de desconto). Depois, R$ 59,00/mês. Promoção válida para cadastros até 31/12/2026.');
  });
  it('só teste grátis; sem promoção não mostra nada', () => {
    expect(text(promotionSummary(promo({ discountPercent: 0, discountMonths: 0, plans: plans.map(p => ({ ...p, discountedCents: null })) }), 'basic', 'PIX')!.lines)).toBe('14 dias grátis. Nada é cobrado agora. Um teste grátis por CPF/CNPJ.');
    expect(promotionSummary(null, 'basic', 'PIX')).toBeNull();
  });
  it('o formulário consulta a promoção quando o código está completo e mostra o resumo', () => {
    const form = readFileSync('src/app/cadastro/RegistrationForm.tsx', 'utf8');
    const route = readFileSync('src/app/api/auth/register/promotion/route.ts', 'utf8');
    expect(route).toContain("platformApi(request, '/api/auth/register/promotion')");
    expect(form).toContain('/api/auth/register/promotion?code=');
    expect(form).toContain('promotionSummary(promotion,planId,paymentMethod)');
    expect(form).toMatch(/\/\^\[A-Z0-9\]\{12\}\$\/\.test\(code\)/);
  });
});
