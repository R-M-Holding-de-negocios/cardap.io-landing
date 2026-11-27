// Tela de eventos do Asaas no painel do administrador (tarefa F3-T20 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AsaasEventsTable, { type AsaasEvent } from '@/components/platform-admin/AsaasEventsTable';
import { platformAdminPathAllowed } from '@/lib/platform-admin-paths';

const event = (overrides: Partial<AsaasEvent>): AsaasEvent => ({
  eventType: 'PAYMENT_RECEIVED', processingStatus: 'processed', ignoreReason: null, receivedAt: '2026-11-26T21:55:33.222Z',
  contractId: 'contrato-1', establishmentId: 'rest-1', restaurantName: 'Bistrô', stalled: false, ...overrides,
});

describe('eventos do Asaas no painel', () => {
  it('a lista fechada do site aceita a rota e recusa vizinhos', () => {
    expect(platformAdminPathAllowed('GET', ['asaas-events'])).toBe(true);
    expect(platformAdminPathAllowed('POST', ['asaas-events'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['asaas-events', 'evt_1'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['asaas-event'])).toBe(false);
  });

  it('mostra evento, tratamento, horário e o restaurante com link para o detalhe', () => {
    const html = renderToStaticMarkup(<AsaasEventsTable items={[event({})]} />);
    expect(html).toContain('PAYMENT_RECEIVED');
    expect(html).toContain('Processado');
    expect(html).toContain('href="/admin/restaurants/rest-1"');
    expect(html).toContain('Bistrô');
    expect(html).toContain('26/11/2026');
  });

  it('evento ignorado mostra o motivo; sem restaurante mostra um traço', () => {
    const html = renderToStaticMarkup(<AsaasEventsTable items={[
      event({ processingStatus: 'ignored', ignoreReason: 'subscription_charge_deleted' }),
      event({ processingStatus: 'ignored', ignoreReason: null, establishmentId: null, restaurantName: null, contractId: null }),
    ]} />);
    expect(html).toContain('Cobrança de assinatura apagada no Asaas');
    expect(html).toContain('Motivo não registrado');
    expect(html.split('href="/admin/restaurants/')).toHaveLength(2);
  });

  it('evento com tratamento interrompido vem destacado', () => {
    const html = renderToStaticMarkup(<AsaasEventsTable items={[event({ processingStatus: 'processing', stalled: true }), event({ processingStatus: 'processing' })]} />);
    expect(html.split('Tratamento interrompido')).toHaveLength(2);
  });

  it('lista vazia tem mensagem própria', () => {
    expect(renderToStaticMarkup(<AsaasEventsTable items={[]} />)).toContain('Nenhum evento do Asaas');
  });

  it('a tela oferece os filtros e o menu leva até ela', () => {
    const page = readFileSync('src/app/admin/(panel)/asaas-events/page.tsx', 'utf8');
    for (const text of ['/api/platform-admin/asaas-events', 'value="ignored"', 'value="processed"', 'value="processing"', 'type="date"']) expect(page).toContain(text);
    expect(readFileSync('src/components/platform-admin/AdminShell.tsx', 'utf8')).toContain("['/admin/asaas-events','Eventos do Asaas']");
  });
});
