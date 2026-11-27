// Botão "Preencher dados de teste" do cadastro (pedido do João em 27/11/2026): só fora da produção.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { randomSignupData, testFillEnabled } from '../src/lib/test-signup-data';

function validCpf(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const digit = (len: number) => { let sum = 0; for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i); const rest = (sum * 10) % 11; return rest === 10 ? 0 : rest; };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

describe('dados de teste do cadastro', () => {
  it('só aparece no Preview da Vercel (homologação) e no desenvolvimento', () => {
    expect(testFillEnabled({ VERCEL_ENV: 'preview', NODE_ENV: 'production' })).toBe(true);
    expect(testFillEnabled({ NODE_ENV: 'development' })).toBe(true);
    expect(testFillEnabled({ VERCEL_ENV: 'production', NODE_ENV: 'production' })).toBe(false);
    expect(testFillEnabled({ NODE_ENV: 'production' })).toBe(false);
    expect(testFillEnabled({})).toBe(false);
  });

  it('gera dados que o cadastro aceita, diferentes a cada vez', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const data = randomSignupData();
      expect(validCpf(data.cpfCnpj)).toBe(true);
      expect(data.email).toMatch(/^teste-[a-z0-9]+@example\.com$/);
      expect(data.phone).toMatch(/^\(\d{2}\) 9\d{4}-\d{4}$/);
      expect(data.password.length).toBeGreaterThanOrEqual(12);
      expect(data.restaurantName.trim()).not.toBe('');
      expect(data.ownerName.trim()).not.toBe('');
      seen.add(data.cpfCnpj); seen.add(data.email);
    }
    expect(seen.size).toBeGreaterThan(390);
  });

  it('o formulário mostra o botão só quando liberado e mostra a senha gerada', () => {
    const form = fs.readFileSync(path.join(process.cwd(), 'src/app/cadastro/RegistrationForm.tsx'), 'utf-8');
    const page = fs.readFileSync(path.join(process.cwd(), 'src/app/cadastro/page.tsx'), 'utf-8');
    expect(page).toContain('testFillEnabled(process.env)');
    expect(form).toMatch(/testFill&&/);
    expect(form).toContain('Preencher dados de teste');
    expect(form).toContain('randomSignupData()');
    expect(form).toMatch(/Senha gerada/);
  });
});
