// Formas de pagamento oferecidas no cadastro: só Pix e cartão (decisão do João em 27/11/2026,
// tarefa F3-T23 do repositório do sistema). A API também recusa boleto em cadastro novo.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('formas de pagamento do cadastro', () => {
  it('oferece Pix e cartão de crédito, e não oferece boleto', () => {
    const form = fs.readFileSync(path.join(process.cwd(), 'src/app/cadastro/RegistrationForm.tsx'), 'utf-8');
    const options = [...form.matchAll(/<option value="([A-Z_]+)"/g)].map(match => match[1]);
    expect(options).toEqual(expect.arrayContaining(['PIX', 'CREDIT_CARD']));
    expect(options).not.toContain('BOLETO');
    expect(form).not.toMatch(/boleto/i);
  });
});
