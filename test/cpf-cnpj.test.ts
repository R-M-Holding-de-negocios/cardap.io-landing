// F3-T6 do repositório Anfc-Cardapios: cópia de frontend/test/cpf-cnpj.test.ts, mesmos casos.
import { describe, expect, it } from 'vitest';
import { normalizeCpfCnpj, validCpfCnpj, passwordProblem, cpfCnpjProblem } from '@/lib/cpf-cnpj';

describe('CPF e CNPJ', () => {
  it('aceita documentos válidos, com ou sem pontuação', () => {
    for (const value of ['529.982.247-25', '52998224725', '24971563792', '11.222.333/0001-81', '11222333000181', '12.ABC.345/01DE-35', '12abc34501de35'])
      expect(validCpfCnpj(value), value).not.toBeNull();
    expect(validCpfCnpj('12.abc.345/01de-35')).toBe('12ABC34501DE35');
    expect(normalizeCpfCnpj(' 529.982.247-25 ')).toBe('52998224725');
  });
  it('recusa verificador errado, sequência repetida, tamanho errado e letra no CPF ou no verificador', () => {
    for (const value of ['52998224724', '11111111111', '00000000000', '11222333000182', '11111111111111', 'AAAAAAAAAAAAAA', '12ABC34501DE3A', '5299822472A', '123.456.789', '', '529982247251'])
      expect(validCpfCnpj(value), value).toBeNull();
  });
  it('explica o erro do documento', () => {
    expect(cpfCnpjProblem('')).toBe('Informe o CPF ou o CNPJ.');
    expect(cpfCnpjProblem('123')).toBe('O CPF tem 11 números e o CNPJ tem 14 caracteres.');
    expect(cpfCnpjProblem('52998224724')).toBe('CPF inválido. Confira os números.');
    expect(cpfCnpjProblem('11222333000182')).toBe('CNPJ inválido. Confira os caracteres.');
    expect(cpfCnpjProblem('52998224725')).toBeNull();
  });
});

describe('senha', () => {
  it('mínimo de 12 caracteres e máximo de 72 bytes, medidos igual no navegador e no servidor', () => {
    expect(passwordProblem('curta')).toBe('Use ao menos 12 caracteres.');
    expect(passwordProblem('a'.repeat(12))).toBeNull();
    expect(passwordProblem('a'.repeat(72))).toBeNull();
    expect(passwordProblem('a'.repeat(73))).toBe('A senha passou do tamanho máximo. Letras com acento e emojis ocupam mais espaço; use até 72 letras sem acento.');
    expect(passwordProblem('ç'.repeat(36))).toBeNull();
    expect(passwordProblem('ç'.repeat(37))).not.toBeNull();
  });
});
