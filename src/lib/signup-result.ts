// Mensagem depois do cadastro, conforme o que a API devolveu (F3-T23 do repositório do sistema):
// conta em teste grátis pela promoção de um afiliado, ou conta aguardando pagamento.
export type SignupResult = { success?: boolean; error?: unknown; subscriptionStatus?: string; trialEndsAt?: string };
export type SignupCompletion = { title: string; text: string; action: string };

export function signupCompletion(result: SignupResult): SignupCompletion {
  const end = result.subscriptionStatus === 'trialing' && result.trialEndsAt ? Date.parse(result.trialEndsAt) : Number.NaN;
  if (!Number.isNaN(end)) {
    const day = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(end);
    return {
      title: 'Conta criada, com teste grátis',
      text: `Seu teste grátis vai até ${day}. Nada é cobrado agora. No fim do teste geramos a cobrança do plano escolhido, e o acesso continua depois do pagamento.`,
      action: 'Entrar no sistema',
    };
  }
  return {
    title: 'Conta criada',
    text: 'Entre com o e-mail e a senha que você acabou de cadastrar para acompanhar o pagamento. Seu cardápio será liberado após a confirmação da cobrança.',
    action: 'Entrar para acompanhar o pagamento',
  };
}
