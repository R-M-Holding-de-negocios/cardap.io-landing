// Plano Pro "em breve" no site (F3-T3 do repositório Anfc-Cardapios): visível, sem contratação, com lista de espera.
import { readFileSync, existsSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ProWaitlist, { waitlistPayload } from '@/components/public/ProWaitlist';

describe('Pro em breve no site', () => {
  it('o cadastro mostra o Pro desabilitado e não o aceita pelo link', () => {
    const form = readFileSync('src/app/cadastro/RegistrationForm.tsx', 'utf8');
    expect(form).toContain("requestedPlan==='basic'?'basic':'essential'");
    expect(form).toContain('comingSoon:true');
    expect(form).toContain('disabled={plan.comingSoon}');
    expect(form).toContain('Em breve');
  });
  it('a página inicial troca o botão do Pro pela lista de espera', () => {
    const page = readFileSync('src/app/page.tsx', 'utf8');
    expect(page).not.toContain('Continuar com o Pro');
    expect(page).toContain('<ProWaitlist />');
  });
  it('o formulário de interesse manda só os campos aceitos, pela rota do site', () => {
    expect(waitlistPayload({ name: ' Ana ', email: ' ana@ex.com ', restaurantName: '', message: ' oi ' })).toEqual({ name: 'Ana', email: 'ana@ex.com', message: 'oi' });
    const html = renderToStaticMarkup(<ProWaitlist />);
    expect(html).toContain('Em breve');
    expect(html).toContain('Quero ser avisado');
    expect(readFileSync('src/components/public/ProWaitlist.tsx', 'utf8')).toContain("fetch('/api/public/pro-waitlist'");
    expect(existsSync('src/app/api/public/pro-waitlist/route.ts')).toBe(true);
    expect(readFileSync('src/app/api/public/pro-waitlist/route.ts', 'utf8')).toContain("platformApi(request, '/api/public/pro-waitlist')");
  });
});
