// Detalhe do restaurante: promoção aplicada no cadastro e a etapa em que está (F3-T23, passo 5,
// do repositório Anfc-Cardapios). A etapa vem calculada da API.
export type RestaurantPromotionData = {
  trialDays: number; discountPercent: number; discountMonths: number;
  stage: 'trial' | 'awaiting_payment' | 'discount' | 'full_price' | 'no_discount';
  trialEndsAt: string | null; discountPaid: number; fullPriceRestoredAt: string | null;
};

const day = (iso: string | null) => {
  const ms = iso ? Date.parse(iso) : Number.NaN;
  return Number.isNaN(ms) ? '—' : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(ms);
};

export function promotionStageLines(p: RestaurantPromotionData): string[] {
  const discount = p.discountPercent > 0 && p.discountMonths > 0 ? `${p.discountPercent}% de desconto em ${p.discountMonths} ${p.discountMonths === 1 ? 'mensalidade' : 'mensalidades'}` : '';
  const trial = p.trialDays > 0 ? `${p.trialDays} dias grátis` : '';
  const offer = `${[trial, discount].filter(Boolean).join(' e ')}.`;
  const stage = {
    trial: `Em teste grátis até ${day(p.trialEndsAt)}.`,
    awaiting_payment: 'Aguardando o primeiro pagamento com desconto.',
    discount: `Mensalidades com desconto: ${p.discountPaid} de ${p.discountMonths} pagas.`,
    full_price: `Desconto encerrado. Assinatura no preço cheio desde ${day(p.fullPriceRestoredAt)}.`,
    no_discount: 'Sem desconto nas mensalidades.',
  }[p.stage];
  // A oferta começa por número ("14 dias") ou por "20%"; a maiúscula só vale se começar por letra.
  return [offer.charAt(0).toUpperCase() + offer.slice(1), stage];
}

export default function RestaurantPromotion({ promotion }: { promotion: RestaurantPromotionData | null }) {
  if (!promotion) return null;
  return <section className="rounded-2xl border border-outline bg-white p-5 text-sm">
    <h2 className="font-bold text-muted">Promoção do afiliado</h2>
    {promotionStageLines(promotion).map(line => <p key={line} className="mt-1">{line}</p>)}
  </section>;
}
