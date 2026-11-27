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
  it('teste grátis e desconto, com o preço de cada fase e o preço cheio depois', () => {
    const summary = promotionSummary(promo(), 'essential')!;
    expect(summary.title).toBe('Promoção aplicada pelo código');
    expect(text(summary.lines)).toBe('14 dias grátis. Nada é cobrado agora. Um teste grátis por CPF/CNPJ. R$ 63,20 nas 2 primeiras mensalidades (20% de desconto). Depois, R$ 79,00/mês.');
  });
  it('o desconto vale no Pix e no cartão (decisão revista em 27/11/2026), sem aviso de forma de pagamento', () => {
    const form = readFileSync('src/lib/signup-promotion.ts', 'utf8');
    expect(form).not.toMatch(/só no Pix|No Pix|cartão/i);
  });
  it('uma mensalidade, sem teste grátis e com prazo de validade', () => {
    const lines = text(promotionSummary(promo({ trialDays: 0, discountMonths: 1, validUntil: '2026-12-31' }), 'basic')!.lines);
    expect(lines).toBe('R$ 47,20 na primeira mensalidade (20% de desconto). Depois, R$ 59,00/mês. Promoção válida para cadastros até 31/12/2026.');
  });
  it('só teste grátis; sem promoção não mostra nada', () => {
    expect(text(promotionSummary(promo({ discountPercent: 0, discountMonths: 0, plans: plans.map(p => ({ ...p, discountedCents: null })) }), 'basic')!.lines)).toBe('14 dias grátis. Nada é cobrado agora. Um teste grátis por CPF/CNPJ.');
    expect(promotionSummary(null, 'basic')).toBeNull();
  });
  it('o formulário consulta a promoção quando o código está completo e mostra o resumo', () => {
    const form = readFileSync('src/app/cadastro/RegistrationForm.tsx', 'utf8');
    const route = readFileSync('src/app/api/auth/register/promotion/route.ts', 'utf8');
    expect(route).toContain("platformApi(request, '/api/auth/register/promotion')");
    expect(form).toContain('/api/auth/register/promotion?code=');
    expect(form).toContain('promotionSummary(promotion,planId)');
    expect(form).toMatch(/\/\^\[A-Z0-9\]\{12\}\$\/\.test\(code\)/);
  });
});
