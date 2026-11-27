// Mensagem depois do cadastro, conforme o que a API devolveu (F3-T23 do repositório do sistema):
// conta em teste grátis pela promoção de um afiliado, ou conta aguardando pagamento.
import { productUrl } from './product-url';

export type SignupResult = { success?: boolean; error?: unknown; subscriptionStatus?: string; trialEndsAt?: string; entryPass?: string };
export type SignupCompletion = { title: string; text: string; action: string; entry?: string | null };

// Passe de entrada (F3-T25): o dono vai do cadastro ao sistema já logado. O passe vai no
// fragmento (#), que não chega aos registros de acesso nem ao Referer.
export function signupEntryUrl(result: SignupResult): string | null {
  const pass = result.entryPass;
  if (typeof pass !== 'string' || !/^[0-9a-f]{64}$/.test(pass)) return null;
  return `${productUrl('/entrar')}#${pass}`;
}

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
