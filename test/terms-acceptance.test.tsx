// Aceite dos termos no cadastro e na candidatura de afiliado (F3-T5 do repositório Anfc-Cardapios).
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import TermsAcceptance from '@/components/public/TermsAcceptance';

describe('caixa de aceite dos termos', () => {
  it('é obrigatória e tem link para os Termos de Uso e a Política de Privacidade', () => {
    const html = renderToStaticMarkup(<TermsAcceptance name="acceptTerms" />);
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('required=""');
    expect(html).toContain('href="/termos-de-uso"');
    expect(html).toContain('href="/politica-de-privacidade"');
    expect(html).toContain('target="_blank"');
  });
  it('mostra o erro apontado pelo servidor', () => {
    expect(renderToStaticMarkup(<TermsAcceptance name="acceptTerms" error="Para continuar, aceite os Termos de Uso e a Política de Privacidade." />)).toContain('role="alert"');
  });
  it('o cadastro e a candidatura usam a caixa e mandam acceptTerms', () => {
    const form = readFileSync('src/app/cadastro/RegistrationForm.tsx', 'utf8');
    expect(form).toContain('<TermsAcceptance');
    expect(form).toContain("acceptTerms:form.get('acceptTerms')==='on'");
    const partners = readFileSync('src/app/parceiros/page.tsx', 'utf8');
    expect(partners).toContain('<TermsAcceptance');
    expect(partners).toContain('acceptTerms: formTerms');
  });
});
