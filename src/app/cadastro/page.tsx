import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { productUrl } from '@/lib/product-url';

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function CadastroPage() {
  return (
    <main className="min-h-screen bg-cream px-5 py-10 text-ink sm:py-16">
      <section className="mx-auto max-w-xl rounded-3xl border border-outline bg-white p-8 shadow-card sm:p-12">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-peach text-action"><Sparkles className="h-6 w-6" /></div>
        <p className="text-sm font-bold uppercase tracking-wider text-action">cardap.io</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Crie o cardápio do seu restaurante</h1>
        <p className="mt-3 leading-relaxed text-muted">Cadastro, escolha de plano e pagamento são feitos no sistema cardap.io. Continue para abrir o cadastro seguro.</p>
        <a href={productUrl('/cadastro')} className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-action px-6 py-3 font-bold text-white shadow-card transition-colors hover:bg-action-hover">
          Continuar para o cadastro <ArrowUpRight className="h-4 w-4" />
        </a>
      </section>
    </main>
  );
}
