// Cadastro leva o dono ao sistema já logado (F3-T25 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { signupEntryUrl } from '@/lib/signup-result';

const PASS = '0123456789abcdef'.repeat(4);

describe('entrada no sistema depois do cadastro', () => {
  it('leva a /entrar do sistema com o passe no fragmento', () => {
    const url = new URL(signupEntryUrl({ success: true, entryPass: PASS })!);
    expect(url.pathname).toBe('/entrar');
    expect(url.hash).toBe(`#${PASS}`);
    expect(url.search).toBe('');
  });
  it('sem passe válido não há entrada direta (fica o login normal)', () => {
    for (const entryPass of [undefined, '', 'abc', PASS + 'x', PASS.toUpperCase(), 42]) expect(signupEntryUrl({ success: true, entryPass } as never)).toBeNull();
  });
  it('o formulário redireciona sozinho, exceto no modo de teste, que mostra os dados e o botão', () => {
    const form = readFileSync('src/app/cadastro/RegistrationForm.tsx', 'utf8');
    expect(form).toContain('signupEntryUrl(result)');
    expect(form).toMatch(/if\(entry&&!testFill\)\{window\.location\.assign\(entry\)/);
    expect(form).toContain("href={complete.entry||productUrl('/login')}");
  });
});
