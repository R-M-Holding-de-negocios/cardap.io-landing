// Promoção vigente do código do afiliado, só leitura (F3-T23, passo 5, do repositório Anfc-Cardapios).
import { partnerPromotionLines, type SignupPromotion } from '@/lib/signup-promotion';

export default function PartnerPromotion({ promotion }: { promotion: SignupPromotion | null }) {
  return <section className="rounded-3xl bg-white border border-outline p-6 space-y-2">
    <h2 className="font-black text-muted">Promoção do seu código</h2>
    {promotion
      ? partnerPromotionLines(promotion).map(line => <p key={line} className="text-sm">{line}</p>)
      : <p className="text-sm text-muted">Nenhuma promoção ativa no seu código agora.</p>}
    <p className="text-xs text-muted">Quem define a promoção é a equipe cardap.io.</p>
  </section>;
}
