// Textos do painel do administrador para os códigos de cobrança devolvidos pela API
// (worker/src/billing.ts no repositório do sistema).

export const CONTRACT_STATUS_LABELS: Record<string, string> = {
  creating: 'Criando cobrança', pending: 'Aguardando pagamento', active: 'Ativo', overdue: 'Inadimplente',
  canceled: 'Cancelado', refunded: 'Estornado', setup_failed: 'Cobrança não criada',
};
export const PAYMENT_METHOD_LABELS: Record<string, string> = { PIX: 'Pix', BOLETO: 'Boleto', CREDIT_CARD: 'Cartão de crédito' };
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
};

export const label = (map: Record<string, string>, code: string | null | undefined) => (code && map[code]) || code || '—';

/** Explica o motivo gravado quando a cobrança não pôde ser criada. */
export function billingErrorLabel(code: string | null | undefined): string {
  if (!code) return '';
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
