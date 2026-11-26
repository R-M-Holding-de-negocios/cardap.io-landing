// Cobrança por restaurante no painel do administrador (tarefa F3-T14 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RestaurantBilling, { type BillingContract, type BillingEvent } from '@/components/platform-admin/RestaurantBilling';
import RestaurantTable, { type RestaurantRow } from '@/components/platform-admin/RestaurantTable';
import { billingErrorLabel } from '@/lib/platform-admin-billing';
import { platformAdminPathAllowed } from '@/lib/platform-admin-paths';

const contract = (overrides: Partial<BillingContract>): BillingContract => ({
  id: 'contrato-1', planId: 'basic_v1', amountCents: 5900, paymentMethod: 'PIX', status: 'pending', createdAt: '2026-11-25T23:26:34.397Z', updatedAt: '2026-11-25T23:26:36.755Z',
  hasCustomer: true, hasPayment: true, hasSubscription: false, invoiceUrl: null, lastErrorCode: null, lastErrorAt: null,
  providerCustomerId: 'cus_1', providerPaymentId: 'pay_1', providerSubscriptionId: null, ...overrides,
});

describe('cobrança por restaurante', () => {
  it('mostra contrato com valor formatado, forma, estado em português e link da fatura', () => {
    const html = renderToStaticMarkup(<RestaurantBilling contracts={[contract({ status: 'active', paymentMethod: 'BOLETO', hasSubscription: true, providerSubscriptionId: 'sub_1', invoiceUrl: 'https://sandbox.asaas.com/i/abc' })]} events={[]} />);
    expect(html).toContain('R$');
    expect(html).toContain('59,00');
    expect(html).toContain('Boleto');
    expect(html).toContain('Ativo');
    expect(html).toContain('href="https://sandbox.asaas.com/i/abc"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('sub_1');
  });

  it('link de fatura que não é https do Asaas não vira link', () => {
    const html = renderToStaticMarkup(<RestaurantBilling contracts={[contract({ invoiceUrl: 'javascript:alert(1)' }), contract({ id: 'c2', invoiceUrl: 'https://exemplo.com/i/abc' })]} events={[]} />);
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('exemplo.com');
  });

  it('explica o motivo da falha em português e mostra o código', () => {
    const html = renderToStaticMarkup(<RestaurantBilling contracts={[contract({ status: 'setup_failed', hasCustomer: false, hasPayment: false, providerCustomerId: null, providerPaymentId: null, lastErrorCode: 'asaas_http_400:invalid_object', lastErrorAt: 1795655395988 })]} events={[]} />);
    expect(html).toContain('Cobrança não criada');
    expect(html).toContain('Dado recusado pelo Asaas');
    expect(html).toContain('CPF/CNPJ');
    expect(html).toContain('asaas_http_400:invalid_object');
    expect(billingErrorLabel('asaas_http_503')).toContain('fora do ar');
    expect(billingErrorLabel('asaas_network')).toContain('conexão');
    expect(billingErrorLabel('asaas_http_401')).toContain('chave');
    expect(billingErrorLabel('codigo_novo_desconhecido')).toContain('Falha não classificada');
    expect(billingErrorLabel(null)).toBe('');
  });

  it('lista eventos do Asaas com tratamento e motivo em português', () => {
    const events: BillingEvent[] = [
      { eventType: 'PAYMENT_RECEIVED', processingStatus: 'processed', ignoreReason: null, receivedAt: '2026-11-25T23:30:03.327Z', contractId: 'contrato-1' },
      { eventType: 'PAYMENT_RECEIVED', processingStatus: 'ignored', ignoreReason: 'value_mismatch', receivedAt: '2026-11-25T23:31:03.327Z', contractId: 'contrato-1' },
      { eventType: 'PAYMENT_CREATED', processingStatus: 'ignored', ignoreReason: null, receivedAt: '2026-11-25T23:22:37.006Z', contractId: null },
    ];
    const html = renderToStaticMarkup(<RestaurantBilling contracts={[]} events={events} />);
    expect(html).toContain('PAYMENT_RECEIVED');
    expect(html).toContain('Processado');
    expect(html).toContain('Ignorado');
    expect(html).toContain('Valor diferente do contratado');
    expect(html).toContain('Motivo não registrado');
  });

  it('sem contrato e sem evento, diz isso', () => {
    const html = renderToStaticMarkup(<RestaurantBilling contracts={[]} events={[]} />);
    expect(html).toContain('Nenhum contrato');
    expect(html).toContain('Nenhum evento');
  });

  it('a lista de restaurantes leva ao detalhe', () => {
    const row: RestaurantRow = { id: 'rest a/1', name: 'Bistrô', subscriptionStatus: 'active', subscriptionPlan: 'basic_v1', accessStatus: 'active', affiliate: null, userCount: 1, supportCount: 0, createdAt: null };
    expect(renderToStaticMarkup(<RestaurantTable items={[row]} onAction={() => {}} />)).toContain('href="/admin/restaurants/rest%20a%2F1"');
  });

  it('o site repassa as duas consultas e recusa vizinhos', () => {
    expect(platformAdminPathAllowed('GET', ['restaurants', 'r1', 'billing'])).toBe(true);
    expect(platformAdminPathAllowed('GET', ['restaurants', 'r1', 'billing-events'])).toBe(true);
    expect(platformAdminPathAllowed('POST', ['restaurants', 'r1', 'billing'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['restaurants', 'r1', 'contact'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['restaurants', 'r1', 'billing', 'x'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['affiliates', 'a1', 'billing'])).toBe(false);
  });

  it('a tela de detalhe consulta o restaurante, os contratos e os eventos', () => {
    const source = readFileSync('src/components/platform-admin/RestaurantDetail.tsx', 'utf8');
    expect(source).toContain('/billing-events');
    expect(source).toContain('/billing?');
    expect(readFileSync('src/app/admin/(panel)/restaurants/[id]/page.tsx', 'utf8')).toContain('RestaurantDetail');
  });
});
