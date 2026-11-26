// Textos do painel do administrador para os códigos de cobrança devolvidos pela API
// (worker/src/billing.ts no repositório do sistema).

export const CONTRACT_STATUS_LABELS: Record<string, string> = {
  creating: 'Criando cobrança', pending: 'Aguardando pagamento', active: 'Ativo', overdue: 'Inadimplente',
  canceled: 'Cancelado', refunded: 'Estornado', setup_failed: 'Cobrança não criada',
};
export const PAYMENT_METHOD_LABELS: Record<string, string> = { PIX: 'Pix', BOLETO: 'Boleto', CREDIT_CARD: 'Cartão de crédito' };
// Liberação manual pelo painel aparece na lista de eventos com este prefixo.
export const eventTypeLabel = (type: string) => type === 'MANUAL_CHARGE_DELETED' ? 'Cobrança apagada no Asaas, confirmada pelo painel' : type.startsWith('MANUAL_RELEASE:') ? `Liberação manual pelo painel (${type.slice('MANUAL_RELEASE:'.length)})` : type;
export const EVENT_STATUS_LABELS: Record<string, string> = { processed: 'Processado', ignored: 'Ignorado', processing: 'Em processamento' };
export const IGNORE_REASON_LABELS: Record<string, string> = {
  malformed_event: 'Evento sem os dados esperados',
  event_not_handled: 'Tipo de evento que o sistema não usa',
  unknown_contract: 'Não pertence a nenhum contrato do sistema',
  reference_mismatch: 'Identificador não confere com o Asaas',
  value_mismatch: 'Valor diferente do contratado',
  method_mismatch: 'Forma de pagamento diferente da contratada',
  customer_mismatch: 'Cliente diferente do contrato',
  subscription_mismatch: 'Assinatura diferente da do contrato',
  state_mismatch: 'O estado no Asaas não confirma o evento',
  contract_canceled: 'Contrato já cancelado',
  invalid_net_value: 'Valor líquido inválido',
  subscription_charge_deleted: 'Cobrança de assinatura apagada no Asaas (só registrado)',
};

export const label = (map: Record<string, string>, code: string | null | undefined) => (code && map[code]) || code || '—';

/** Explica o motivo gravado quando a cobrança não pôde ser criada. */
export function billingErrorLabel(code: string | null | undefined): string {
  if (!code) return '';
  if (code === 'charge_deleted') return 'A cobrança foi apagada no Asaas. Gere uma nova.';
  if (code === 'asaas_network') return 'Falha de conexão com o Asaas.';
  if (code === 'asaas_not_configured') return 'A chave do Asaas não está configurada neste ambiente.';
  if (code === 'asaas_unexpected_response') return 'O Asaas respondeu sem os dados esperados.';
  if (code === 'ambiguous_provider_state') return 'Há mais de um registro no Asaas para esta contratação. Conferir no painel do Asaas antes de tentar de novo.';
  if (code === 'internal_error') return 'Erro interno ao criar a cobrança.';
  const http = /^asaas_http_(\d{3})/.exec(code);
  if (http) {
    const status = Number(http[1]);
    if (status === 400) return 'Dado recusado pelo Asaas. Conferir CPF/CNPJ, e-mail e telefone do responsável.';
    if (status === 401 || status === 403) return 'O Asaas recusou a chave da API deste ambiente.';
    if (status === 429) return 'O Asaas limitou as chamadas. Tentar de novo em alguns minutos.';
    if (status >= 500) return 'O Asaas estava fora do ar ou instável.';
    return 'O Asaas recusou a operação.';
  }
  return 'Falha não classificada.';
}

/** Só vira link a fatura hospedada no Asaas, por https. */
export function safeInvoiceUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'asaas.com' || url.hostname.endsWith('.asaas.com')) ? url.toString() : null;
  } catch { return null; }
}

export const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
export function dateTime(value: string | number | null | undefined): string {
  const time = typeof value === 'number' ? value : value ? Date.parse(value) : Number.NaN;
  return Number.isNaN(time) ? '—' : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(time);
}

// Ações de cobrança do painel (F3-T16). A liberação não tem como ser forçada: o servidor só
// libera depois de consultar o Asaas.
export const BILLING_ACTIONS = {
  'billing-check': { title: 'Conferir com o Asaas', help: 'Consulta a cobrança e a assinatura no Asaas agora e mostra a diferença para o sistema. Não altera nada.' },
  'billing-retry': { title: 'Tentar criar a cobrança de novo', help: 'Para cobrança que não pôde ser criada ou que foi apagada no Asaas (o sistema confirma no Asaas na hora). Usa a mesma retomada do sistema e nunca cria uma segunda cobrança.' },
  'billing-release': { title: 'Liberar conta com pagamento confirmado', help: 'O sistema consulta o Asaas na hora e só libera se o pagamento desta cobrança estiver recebido ou confirmado, com valor, forma e cliente conferidos. Sem confirmação do Asaas, a ação é recusada.' },
} as const;
export type BillingActionName = keyof typeof BILLING_ACTIONS;

const DIFFERENCE_LABELS: Record<string, string> = {
  paid_not_applied: 'A cobrança está paga no Asaas, mas a conta ainda não foi liberada no sistema.',
  subscription_missing: 'A conta está ativa, mas não existe assinatura no Asaas: a renovação mensal não será cobrada.',
  subscription_not_linked: 'Existe uma assinatura no Asaas para este contrato, mas ela ainda não está vinculada no sistema.',
  payment_deleted: 'A cobrança deste contrato foi apagada no Asaas.',
  subscription_ambiguous: 'Há mais de uma assinatura no Asaas para este contrato. Conferir no painel do Asaas.',
};
export const billingDifferenceLabel = (code: string) => DIFFERENCE_LABELS[code] || `Diferença não classificada (${code}).`;
