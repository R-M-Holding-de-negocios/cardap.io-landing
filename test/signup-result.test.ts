// Mensagem depois do cadastro: teste grátis ou aguardando pagamento (F3-T23 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { signupCompletion } from '@/lib/signup-result';

describe('mensagem depois do cadastro', () => {
  it('conta em teste grátis diz até quando vai e que nada é cobrado agora', () => {
    const done = signupCompletion({ success: true, subscriptionStatus: 'trialing', trialEndsAt: '2026-12-15T15:00:00.000Z' });
    expect(done.title).toBe('Conta criada, com teste grátis');
    expect(done.text).toContain('até 15/12/2026');
    expect(done.text).toContain('Nada é cobrado agora');
    expect(done.action).toBe('Entrar no sistema');
  });
  it('sem teste, mantém a mensagem de acompanhar o pagamento', () => {
    for (const result of [{ success: true, subscriptionStatus: 'pending_payment' }, { success: true }, { success: true, subscriptionStatus: 'trialing' }, { success: true, subscriptionStatus: 'trialing', trialEndsAt: 'x' }]) {
      const done = signupCompletion(result);
      expect(done.title).toBe('Conta criada');
      expect(done.action).toBe('Entrar para acompanhar o pagamento');
    }
  });
  it('o formulário usa a mensagem e explica que o código pode trazer promoção', () => {
    const form = readFileSync('src/app/cadastro/RegistrationForm.tsx', 'utf8');
    expect(form).toContain('signupCompletion(result)');
    expect(form).toContain('Cupom ou código de afiliado');
    expect(form).not.toContain('não altera o preço');
  });
});
