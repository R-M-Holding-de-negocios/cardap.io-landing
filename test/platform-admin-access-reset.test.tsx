// Link de emergência para o dono ou gerente redefinir a senha (F3-T9 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { accessResetLink } from '@/lib/access-reset';
import { platformAdminPathAllowed } from '@/lib/platform-admin-paths';
import { AccessResetLink } from '@/components/platform-admin/RestaurantAccessReset';

const TOKEN = 'ab'.repeat(32);

describe('link de redefinição de senha no admin', () => {
  it('aponta para o sistema, com o token no fragmento', () => {
    const link = accessResetLink(TOKEN)!;
    expect(link).toMatch(/\/redefinir-senha#(ab){32}$/);
    expect(link.split('#')[0]).not.toContain(TOKEN);
    expect(new URL(link).pathname).toBe('/redefinir-senha');
  });
  it('recusa token fora do formato', () => {
    for (const bad of ['', 'x', TOKEN.toUpperCase(), `${TOKEN}0`, '../dashboard']) expect(accessResetLink(bad)).toBeNull();
  });
  it('mostra o link uma vez, com o aviso de validade e de envio fora do sistema', () => {
    const html = renderToStaticMarkup(<AccessResetLink link={accessResetLink(TOKEN)!} name="Dona Ana" />);
    expect(html).toContain('/redefinir-senha#');
    expect(html).toContain('15 minutos');
    expect(html).toContain('não aparece de novo');
    expect(html).toContain('Dona Ana');
  });
  it('o proxy do admin libera só as duas rotas novas', () => {
    expect(platformAdminPathAllowed('GET', ['restaurants', 'r1', 'users'])).toBe(true);
    expect(platformAdminPathAllowed('POST', ['restaurants', 'r1', 'users', 'u1', 'access-reset'])).toBe(true);
    expect(platformAdminPathAllowed('GET', ['restaurants', 'r1', 'users', 'u1', 'access-reset'])).toBe(false);
    expect(platformAdminPathAllowed('POST', ['restaurants', 'r1', 'users', 'u1', 'delete'])).toBe(false);
    expect(platformAdminPathAllowed('POST', ['restaurants', 'r1', 'users'])).toBe(false);
    expect(platformAdminPathAllowed('POST', ['restaurants', 'r1', 'users', '..', 'access-reset'])).toBe(false);
  });
  it('a tela do restaurante usa a ferramenta, que pede motivo e lista só dono e gerentes', () => {
    expect(readFileSync('src/components/platform-admin/RestaurantDetail.tsx', 'utf8')).toContain('<RestaurantAccessReset');
    const tool = readFileSync('src/components/platform-admin/RestaurantAccessReset.tsx', 'utf8');
    expect(tool).toContain('/users`');
    expect(tool).toContain('/access-reset`');
    expect(tool).toContain('JSON.stringify({ reason })');
    expect(tool).toMatch(/minLength=\{3\}/);
  });
});
