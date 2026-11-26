// Ações de cobrança no painel do administrador (tarefa F3-T16 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import BillingCheckResult, { type BillingCheck } from '@/components/platform-admin/BillingCheckResult';
import { BILLING_ACTIONS, billingDifferenceLabel } from '@/lib/platform-admin-billing';
import { platformAdminPathAllowed } from '@/lib/platform-admin-paths';

const check = (overrides: Partial<BillingCheck>): BillingCheck => ({
  differences: ['none'],
  database: { contractId: 'c1', contractStatus: 'pending', accountStatus: 'pending_payment', paymentMethod: 'PIX', amountCents: 5900, hasPayment: true, hasSubscription: false },
  asaas: { paymentStatus: 'PENDING', paymentDeleted: false, subscriptionStatus: null, subscriptionId: null },
  ...overrides,
});

describe('ações de cobrança', () => {
  it('conferência sem diferença diz que o banco e o Asaas concordam', () => {
    const html = renderToStaticMarkup(<BillingCheckResult result={check({})} />);
    expect(html).toContain('O sistema e o Asaas estão de acordo');
    expect(html).toContain('Aguardando pagamento');
    expect(html).toContain('PENDING');
  });

  it('conferência com diferença explica cada uma em português', () => {
    const html = renderToStaticMarkup(<BillingCheckResult result={check({ differences: ['paid_not_applied'], asaas: { paymentStatus: 'RECEIVED', paymentDeleted: false, subscriptionStatus: null, subscriptionId: null } })} />);
    expect(html).not.toContain('estão de acordo');
    expect(html).toContain('paga no Asaas');
    expect(billingDifferenceLabel('subscription_missing')).toContain('assinatura');
    expect(billingDifferenceLabel('subscription_not_linked')).toContain('vinculada');
    expect(billingDifferenceLabel('payment_deleted')).toContain('apagada');
    expect(billingDifferenceLabel('subscription_ambiguous')).toContain('mais de uma');
    expect(billingDifferenceLabel('codigo_novo')).toContain('codigo_novo');
  });

  it('cada ação tem título, explicação e o texto do botão; a liberação avisa que depende do Asaas', () => {
    expect(Object.keys(BILLING_ACTIONS).sort()).toEqual(['billing-check', 'billing-release', 'billing-retry']);
    for (const action of Object.values(BILLING_ACTIONS)) { expect(action.title.length).toBeGreaterThan(5); expect(action.help.length).toBeGreaterThan(20); }
    expect(BILLING_ACTIONS['billing-release'].help).toContain('Asaas');
    expect(BILLING_ACTIONS['billing-release'].help).toContain('pagamento');
  });

  it('o site repassa as três ações só por POST e recusa vizinhos', () => {
    for (const action of ['billing-retry', 'billing-check', 'billing-release']) {
      expect(platformAdminPathAllowed('POST', ['restaurants', 'r1', action])).toBe(true);
      expect(platformAdminPathAllowed('GET', ['restaurants', 'r1', action])).toBe(false);
    }
    expect(platformAdminPathAllowed('POST', ['restaurants', 'r1', 'billing-force'])).toBe(false);
    expect(platformAdminPathAllowed('POST', ['restaurants', 'r1', 'billing'])).toBe(false);
    expect(platformAdminPathAllowed('POST', ['restaurants', 'r1', 'billing-release', 'force'])).toBe(false);
  });

  it('a tela envia só o motivo, mostra a recusa da API e não tem opção de forçar', () => {
    const source = readFileSync('src/components/platform-admin/BillingActions.tsx', 'utf8');
    expect(source).toContain('JSON.stringify({ reason })');
    expect(source).not.toMatch(/force/i);
    expect(source).toContain('role="alert"');
    expect(readFileSync('src/components/platform-admin/RestaurantDetail.tsx', 'utf8')).toContain('BillingActions');
  });

  it('recarregar os dados depois de uma ação não desmonta as ações (o resultado continua na tela)', () => {
    const detail = readFileSync('src/components/platform-admin/RestaurantDetail.tsx', 'utf8');
    const gate = detail.slice(0, detail.indexOf('<BillingActions')).trimEnd().split('\n').pop() || '';
    expect(gate).toContain('{ready && <>');
    expect(gate).not.toContain('loading');
  });
});
