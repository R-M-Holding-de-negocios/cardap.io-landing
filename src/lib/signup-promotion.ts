// Promoção do código do afiliado mostrada no cadastro antes de confirmar (F3-T23, passo 5, do
// repositório Anfc-Cardapios). Os valores vêm da API, calculados como na cobrança.

export type SignupPromotion = {
  trialDays: number; discountPercent: number; discountMonths: number; validUntil: string | null;
  plans: { planId: string; fullCents: number; discountedCents: number | null }[];
};

const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
const months = (n: number) => n === 1 ? 'na primeira mensalidade' : `nas ${n} primeiras mensalidades`;

export function promotionSummary(promotion: SignupPromotion | null, planId: string): { title: string; lines: string[] } | null {
  if (!promotion) return null;
  const plan = promotion.plans.find(item => item.planId === planId);
  const lines: string[] = [];
  if (promotion.trialDays > 0) lines.push(`${promotion.trialDays} dias grátis. Nada é cobrado agora.`, 'Um teste grátis por CPF/CNPJ.');
  if (plan && promotion.discountPercent > 0 && promotion.discountMonths > 0 && plan.discountedCents !== null) {
    // Vale nas duas formas de pagamento (decisão revista em 27/11/2026, depois do teste no sandbox).
    lines.push(`${money(plan.discountedCents)} ${months(promotion.discountMonths)} (${promotion.discountPercent}% de desconto).`, `Depois, ${money(plan.fullCents)}/mês.`);
  }
  if (promotion.validUntil && /^\d{4}-\d{2}-\d{2}$/.test(promotion.validUntil)) lines.push(`Promoção válida para cadastros até ${promotion.validUntil.split('-').reverse().join('/')}.`);
  return lines.length ? { title: 'Promoção aplicada pelo código', lines } : null;
}

// Portal do afiliado: a promoção vigente dele, só leitura. Mostra os planos contratáveis
// (o Pro está "em breve" no lançamento).
const PARTNER_PLANS: Record<string, string> = { basic: 'Básico', essential: 'Essencial' };
export function partnerPromotionLines(promotion: SignupPromotion): string[] {
  const lines: string[] = [];
  if (promotion.trialDays > 0) lines.push(`${promotion.trialDays} dias grátis para o restaurante. Um teste grátis por CPF/CNPJ.`);
  const discounted = promotion.discountPercent > 0 && promotion.discountMonths > 0
    ? promotion.plans.filter(plan => PARTNER_PLANS[plan.planId] && plan.discountedCents !== null) : [];
  if (discounted.length) {
    lines.push(`${promotion.discountPercent}% de desconto ${months(promotion.discountMonths)}, no Pix e no cartão:`);
    for (const plan of discounted) lines.push(`${PARTNER_PLANS[plan.planId]}: ${money(plan.discountedCents!)}, depois ${money(plan.fullCents)}/mês.`);
  }
  if (promotion.validUntil && /^\d{4}-\d{2}-\d{2}$/.test(promotion.validUntil)) lines.push(`Válida para cadastros até ${promotion.validUntil.split('-').reverse().join('/')}.`);
  const commission = [promotion.trialDays > 0 ? 'Durante o teste grátis não há comissão.' : '', discounted.length ? 'Nas mensalidades com desconto, a comissão é calculada sobre o valor com desconto.' : ''].filter(Boolean).join(' ');
  if (commission) lines.push(commission);
  return lines;
}
