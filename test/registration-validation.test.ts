// Cadastro do site: CPF/CNPJ e senha conferidos antes de enviar, com mensagem por campo (F3-T6).
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const SAAS_COPY = '../CARDAPIO-ANFC/Anfc-Cardapios/frontend/src/lib/cpf-cnpj.ts';

describe('validação no formulário de cadastro', () => {
  it.skipIf(!existsSync(SAAS_COPY))('a regra é cópia idêntica da do sistema', () => {
    const normalize = (text: string) => text.replace(/\r\n/g, '\n');
    expect(normalize(readFileSync('src/lib/cpf-cnpj.ts', 'utf8'))).toBe(normalize(readFileSync(SAAS_COPY, 'utf8')));
  });
  it('confere antes de enviar e mostra o erro embaixo do campo, inclusive o que o servidor apontar', () => {
    const form = readFileSync('src/app/cadastro/RegistrationForm.tsx', 'utf8');
    expect(form).toContain('cpfCnpjProblem(');
    expect(form).toContain('passwordProblem(');
    expect(form).toContain('normalizeCpfCnpj(');
    expect(form).toContain("result.field==='cpfCnpj'||result.field==='password'");
    expect(form).toContain('fieldErrors.cpfCnpj&&');
    expect(form).toContain('fieldErrors.password&&');
    expect(form).not.toContain('maxLength={72}');
    expect(form).not.toContain('pattern="[0-9./ -]{11,18}"');
  });
});
