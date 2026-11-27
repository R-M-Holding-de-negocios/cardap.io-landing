// Busca por e-mail do dono e filtro por acesso na lista de restaurantes do painel
// (tarefa F3-T17 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('src/app/admin/(panel)/restaurants/page.tsx', 'utf8');

describe('lista de restaurantes: busca e filtros', () => {
  it('o campo de busca avisa que aceita o e-mail do dono', () => {
    expect(source).toContain('Nome, identificação ou e-mail do dono');
  });
  it('oferece o filtro por estado da assinatura e o envia à API como status', () => {
    for (const text of ['Aguardando pagamento', 'Inadimplente', 'Cancelada', 'value="pending_payment"', 'value="overdue"', 'value="canceled"']) expect(source).toContain(text);
    expect(source).toMatch(/status\?\{status\}/);
  });
  it('oferece o filtro por acesso e o envia à API como access', () => {
    expect(source).toContain('Acesso suspenso');
    expect(source).toContain('Acesso ativo');
    expect(source).toMatch(/access\?\{access\}/);
  });
});
