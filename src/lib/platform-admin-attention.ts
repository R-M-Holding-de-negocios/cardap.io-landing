// Condições da fila "precisa de atenção" do painel do administrador. Os códigos vêm da API
// (worker/src/platform-admin/attention.ts no repositório do sistema).
export const ATTENTION_CODES = ['charge_failed', 'missing_subscription', 'overdue', 'price_not_restored', 'stalled_signup'] as const;
export type AttentionCode = typeof ATTENTION_CODES[number];

export const ATTENTION_LABELS: Record<AttentionCode, { label: string; help: string }> = {
  charge_failed: { label: 'Cobrança não criada', help: 'A cobrança não pôde ser gerada no Asaas. O cliente não consegue pagar.' },
  missing_subscription: { label: 'Sem assinatura no Asaas', help: 'A renovação mensal não será cobrada até a assinatura existir no Asaas.' },
  overdue: { label: 'Inadimplente', help: 'A cobrança venceu e não foi paga.' },
  price_not_restored: { label: 'Não voltou ao preço cheio', help: 'As mensalidades com desconto da promoção acabaram, mas a assinatura no Asaas continua com o valor com desconto há mais de 1 hora.' },
  stalled_signup: { label: 'Cadastro parado', help: 'O cadastro aguarda pagamento há mais de 3 dias.' },
};

export const isAttentionCode = (value: string): value is AttentionCode => (ATTENTION_CODES as readonly string[]).includes(value);
