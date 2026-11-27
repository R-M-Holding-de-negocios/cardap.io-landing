// Tela de saúde do sistema no painel do administrador (tarefa F3-T21 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HealthPanel, { type SystemHealth } from '@/components/platform-admin/HealthPanel';
import { platformAdminPathAllowed } from '@/lib/platform-admin-paths';

const NOW = Date.parse('2026-11-26T22:00:00.000Z'), MINUTE = 60_000;
const health = (overrides: Partial<SystemHealth> = {}): SystemHealth => ({
  now: NOW, lastWebhookAt: '2026-11-26T21:55:37.020Z', scheduled: { at: NOW - MINUTE, stalled: false },
  checks: { heartbeat: { at: NOW - MINUTE, status: 'ok' }, payments: { at: NOW - 3 * MINUTE, status: 'ok' } },
  webhookFailures: { confirmFailed: 0, tokenRejected: 0 }, ...overrides,
});
const render = (value: SystemHealth) => renderToStaticMarkup(<HealthPanel health={value} />);

describe('saúde do sistema no painel', () => {
  it('a lista fechada do site aceita a rota e recusa vizinhos', () => {
    expect(platformAdminPathAllowed('GET', ['health'])).toBe(true);
    expect(platformAdminPathAllowed('POST', ['health'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['health', 'ping'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['healthz'])).toBe(false);
  });

  it('tudo em ordem: mostra os horários e nenhum aviso', () => {
    const html = render(health());
    expect(html).toContain('26/11/2026');
    expect(html).toContain('Rodando');
    expect(html.split('Sem falha')).toHaveLength(3);
    expect(html).not.toContain('role="alert"');
  });

  it('avisa quando a tarefa periódica está parada', () => {
    const html = render(health({ scheduled: { at: NOW - 9 * MINUTE, stalled: true } }));
    expect(html).toContain('role="alert"');
    expect(html).toContain('A tarefa periódica está parada');
    expect(render(health({ scheduled: { at: null, stalled: true } }))).toContain('Nunca rodou');
  });

  it('traduz o estado de cada verificação', () => {
    const html = render(health({ checks: { heartbeat: { at: NOW, status: 'send_failed' }, payments: { at: NOW, status: 'fail' } } }));
    expect(html).toContain('O aviso não pôde ser enviado');
    expect(html).toContain('Falha avisada');
    expect(html).toContain('precisa de atenção');
    const off = render(health({ checks: { heartbeat: { at: NOW, status: 'not_configured' }, payments: { at: null, status: null } } }));
    expect(off).toContain('Aviso não configurado neste ambiente');
    expect(off).toContain('Ainda não rodou');
  });

  it('mostra as falhas seguidas do webhook e avisa a partir de três', () => {
    expect(render(health({ webhookFailures: { confirmFailed: 2, tokenRejected: 0 } }))).not.toContain('role="alert"');
    const html = render(health({ webhookFailures: { confirmFailed: 0, tokenRejected: 3 } }));
    expect(html).toContain('role="alert"');
    expect(html).toContain('recusados por token');
  });

  it('sem webhook recebido diz isso, sem inventar horário', () => {
    expect(render(health({ lastWebhookAt: null }))).toContain('Nenhum evento recebido');
  });

  it('a tela consulta a rota e o menu leva até ela', () => {
    expect(readFileSync('src/app/admin/(panel)/health/page.tsx', 'utf8')).toContain('/api/platform-admin/health');
    expect(readFileSync('src/components/platform-admin/AdminShell.tsx', 'utf8')).toContain("['/admin/health','Saúde do sistema']");
  });
});
