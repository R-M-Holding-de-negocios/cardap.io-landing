// Textos do painel para cobrança apagada no Asaas (tarefa F3-T22 do repositório do sistema).
import { describe, expect, it } from 'vitest';
import { BILLING_ACTIONS, IGNORE_REASON_LABELS, billingErrorLabel, eventTypeLabel, label } from '@/lib/platform-admin-billing';

describe('painel: cobrança apagada no Asaas', () => {
  it('explica o motivo gravado no contrato', () => {
    expect(billingErrorLabel('charge_deleted')).toBe('A cobrança foi apagada no Asaas. Gere uma nova.');
  });
  it('traduz o evento de cobrança de assinatura apagada', () => {
    expect(label(IGNORE_REASON_LABELS, 'subscription_charge_deleted')).toContain('assinatura apagada');
  });
  it('nomeia a confirmação feita pelo painel na lista de eventos', () => {
    expect(eventTypeLabel('MANUAL_CHARGE_DELETED')).toBe('Cobrança apagada no Asaas, confirmada pelo painel');
    expect(eventTypeLabel('MANUAL_RELEASE:PAYMENT_RECEIVED')).toContain('Liberação manual');
    expect(eventTypeLabel('PAYMENT_DELETED')).toBe('PAYMENT_DELETED');
  });
  it('a ajuda de "tentar de novo" cobre a cobrança apagada', () => {
    expect(BILLING_ACTIONS['billing-retry'].help).toContain('apagada no Asaas');
  });
});
