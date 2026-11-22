import Link from 'next/link';
import type { ReactNode } from 'react';
import CookiePreferencesButton from './CookiePreferencesButton';

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return <div className="presentation-theme min-h-screen bg-cream text-ink">
    <header className="border-b border-outline bg-white"><div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4"><Link href="/" className="text-2xl font-black text-action" aria-label="cardap.io — início">cardap.io</Link><Link href="/" className="font-bold text-action underline">Voltar ao início</Link></div></header>
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-wider text-action">cardap.io · informações legais</p>
      <h1 className="mt-3 text-3xl font-black sm:text-5xl">{title}</h1>
      <p className="mt-4 rounded-xl border border-orange-200 bg-peach p-4 text-sm leading-relaxed">Documento referente a esta landing isolada. A identificação do responsável e os detalhes do serviço contratado ainda precisam ser confirmados antes da publicação. As regras de cadastro, pagamento e contas do sistema principal exigem revisão específica.</p>
      <div className="legal-content mt-10 space-y-8 leading-relaxed text-muted">{children}</div>
    </main>
    <footer className="border-t border-outline bg-peach px-5 py-8"><nav aria-label="Documentos legais" className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-3 text-sm font-semibold"><Link href="/termos-de-uso">Termos de Uso</Link><Link href="/politica-de-privacidade">Privacidade</Link><Link href="/politica-de-cookies">Cookies</Link><CookiePreferencesButton /></nav></footer>
  </div>;
}
