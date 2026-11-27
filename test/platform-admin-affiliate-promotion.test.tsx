// Promoção por afiliado no painel do administrador (tarefa F3-T23 do repositório Anfc-Cardapios, passo 2).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AffiliatePromotion, { promotionSummary } from '@/components/platform-admin/AffiliatePromotion';
import { platformAdminPathAllowed } from '@/lib/platform-admin-paths';

const promotion = { active: true, trialDays: 14, discountPercent: 30, discountMonths: 3, validUntil: '2027-01-31' };

describe('promoção por afiliado no painel', () => {
  it('a lista fechada do site aceita a ação e recusa vizinhos', () => {
    expect(platformAdminPathAllowed('POST', ['affiliates', 'aff-1', 'promotion'])).toBe(true);
    expect(platformAdminPathAllowed('GET', ['affiliates', 'aff-1', 'promotion'])).toBe(false);
    expect(platformAdminPathAllowed('POST', ['affiliates', 'aff-1', 'promotions'])).toBe(false);
    expect(platformAdminPathAllowed('POST', ['restaurants', 'rest-1', 'promotion'])).toBe(false);
  });

  it('resume a promoção como o cliente vai ler', () => {
    expect(promotionSummary(promotion)).toBe('Ativa: 14 dias de teste grátis e 30% de desconto nas 3 primeiras mensalidades, para cadastros até 31/01/2027.');
    expect(promotionSummary({ ...promotion, active: false, trialDays: 0, discountMonths: 1, validUntil: null })).toBe('Desligada: 30% de desconto na primeira mensalidade.');
    expect(promotionSummary({ ...promotion, trialDays: 1, discountPercent: 0, discountMonths: 0, validUntil: null })).toBe('Ativa: 1 dia de teste grátis.');
    expect(promotionSummary(null)).toBe('Nenhuma promoção configurada.');
  });

  it('o formulário traz os campos com os valores atuais e exige motivo', () => {
    const html = renderToStaticMarkup(<AffiliatePromotion affiliateId="aff-1" status="approved" promotion={promotion} onSaved={() => {}} />);
    for (const text of ['Promoção ativa', 'Dias de teste grátis', 'Desconto (%)', 'Mensalidades com desconto', 'Válida para cadastros até', 'Motivo', 'value="14"', 'value="30"', 'value="3"', 'value="2027-01-31"', 'max="90"', 'max="365"']) expect(html).toContain(text);
    expect(html).toContain('não altera quem já se cadastrou');
    expect(html).not.toContain('Só afiliado aprovado');
  });

  it('afiliado não aprovado vê o aviso', () => {
    expect(renderToStaticMarkup(<AffiliatePromotion affiliateId="aff-1" status="pending" promotion={null} onSaved={() => {}} />)).toContain('Só afiliado aprovado pode ter promoção ativa');
  });

  it('o detalhe do afiliado usa o bloco', () => {
    expect(readFileSync('src/app/admin/(panel)/affiliates/page.tsx', 'utf8')).toContain('<AffiliatePromotion key={detail.id}');
  });
});
