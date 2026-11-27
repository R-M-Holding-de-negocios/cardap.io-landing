import { dateTime } from '@/lib/platform-admin-billing';

type Check = { at: number | null; status: string | null };
export type SystemHealth = {
  now: number; lastWebhookAt: string | null;
  scheduled: { at: number | null; stalled: boolean };
  checks: { heartbeat: Check; payments: Check };
  webhookFailures: { confirmFailed: number; tokenRejected: number };
};

// Mesmo limite do aviso externo (worker/src/alerts.ts): três falhas seguidas.
const STREAK_ALERT = 3;
const CHECK_STATUS: Record<string, string> = {
  ok: 'Sem falha',
  fail: 'Falha avisada',
  send_failed: 'O aviso não pôde ser enviado',
  not_configured: 'Aviso não configurado neste ambiente',
};
const card = 'rounded-2xl border border-outline bg-white p-5';
const warning = 'rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-900';

function CheckCard({ title, help, check, failHint }: { title: string; help: string; check: Check; failHint?: string }) {
  return <div className={card}>
    <h2 className="font-black">{title}</h2>
    <p className="text-sm text-muted">{help}</p>
    <p className="mt-3 text-lg font-bold">{check.status ? CHECK_STATUS[check.status] || check.status : 'Ainda não rodou'}</p>
    <p className="text-sm text-muted">Última execução: {dateTime(check.at)}</p>
    {check.status === 'fail' && failHint && <p className="mt-2 text-sm">{failHint}</p>}
  </div>;
}

// Saúde do sistema (F3-T21). Só horários, estados e contagens.
export default function HealthPanel({ health }: { health: SystemHealth }) {
  const { scheduled, webhookFailures } = health;
  return <div className="space-y-4">
    {scheduled.stalled && <p role="alert" className={warning}><strong>A tarefa periódica está parada.</strong> Ela roda a cada minuto e não registra execução há mais de 5 minutos. Sem ela, visitas não expiram, assinaturas não são conferidas e o aviso externo não sai.</p>}
    {webhookFailures.confirmFailed >= STREAK_ALERT && <p role="alert" className={warning}><strong>{webhookFailures.confirmFailed} eventos seguidos sem confirmação no Asaas.</strong> O sistema recebeu os eventos, mas não conseguiu consultar o Asaas para confirmá-los.</p>}
    {webhookFailures.tokenRejected >= STREAK_ALERT && <p role="alert" className={warning}><strong>{webhookFailures.tokenRejected} eventos seguidos recusados por token.</strong> O token do webhook configurado no Asaas pode estar diferente do configurado no sistema.</p>}
    <div className="grid gap-4 md:grid-cols-2">
      <div className={card}>
        <h2 className="font-black">Último evento do Asaas</h2>
        <p className="text-sm text-muted">Último webhook recebido, de qualquer tipo.</p>
        <p className="mt-3 text-lg font-bold">{health.lastWebhookAt ? dateTime(health.lastWebhookAt) : 'Nenhum evento recebido'}</p>
        <p className="text-sm text-muted">Falhas seguidas: {webhookFailures.confirmFailed} sem confirmação, {webhookFailures.tokenRejected} recusados por token.</p>
      </div>
      <div className={card}>
        <h2 className="font-black">Tarefa periódica</h2>
        <p className="text-sm text-muted">Roda a cada minuto.</p>
        <p className="mt-3 text-lg font-bold">{scheduled.at === null ? 'Nunca rodou' : scheduled.stalled ? 'Parada' : 'Rodando'}</p>
        <p className="text-sm text-muted">Última execução: {dateTime(scheduled.at)}</p>
      </div>
      <CheckCard title="Aviso de batimento" help="Sinal de vida enviado ao serviço de monitoramento a cada minuto." check={health.checks.heartbeat} />
      <CheckCard title="Aviso de pagamentos" help="Estado dos pagamentos enviado a cada 5 minutos." check={health.checks.payments} failHint="Há problema de pagamento que precisa de atenção. O detalhe está na fila da visão geral." />
    </div>
    <p className="text-sm text-muted">Consulta feita em {dateTime(health.now)}, horário de Brasília.</p>
  </div>;
}
