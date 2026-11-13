'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import LiveDemoSimulator from '@/components/public/LiveDemoSimulator';
import ProductPreview from '@/components/public/ProductPreview';
import TextLoop from '@/components/public/react-bits/TextLoop';
import ScrollReveal from '@/components/public/react-bits/ScrollReveal';
import RotatingText from '@/components/public/react-bits/RotatingText';
import PixelCard from '@/components/public/react-bits/PixelCard';
import LandingThemeProvider from '@/components/public/LandingThemeProvider';
import { LANDING_ICONS } from '@/lib/landing-assets';
import { planSignupUrl, productUrl, type PlanId } from '@/lib/product-url';
import { Sparkles, ArrowRight, CheckCircle2, QrCode, Smartphone, Tv, HelpCircle, Utensils, ClipboardList, Users, PackageCheck, ShoppingBag } from 'lucide-react';

const faqs = [
  { q: 'O cliente precisa instalar um aplicativo?', a: 'Não. O cardápio abre no navegador do celular após a leitura do QR Code ou a aproximação por NFC.' },
  { q: 'O cliente pode pedir pelo próprio celular?', a: 'Sim. Ele pode selecionar produtos, ajustar quantidades, adicionar observações e enviar o pedido associado à mesa.' },
  { q: 'O sistema processa pagamentos pela internet?', a: 'O cardap.io permite que o cliente solicite a conta pelo cardápio. O registro do pagamento é feito pela equipe do estabelecimento.' },
  { q: 'A equipe consegue acompanhar chamadas e pedidos?', a: 'Sim. As solicitações aparecem em uma fila para a equipe acompanhar, aceitar e concluir.' },
  { q: 'O cardap.io tem integração com iFood?', a: 'A integração com iFood ainda está em validação. A disponibilidade para cada restaurante será confirmada antes da ativação.' },
];

export default function HomePage() {
  useEffect(() => {
    const page = document.querySelector('.home-theme');
    const targets = page?.querySelectorAll('main :is(h1,h2,h3,h4,p,li)');
    if (!page || !targets?.length) return;
    page.classList.add('home-text-entrances-ready');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('home-text-entered');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <LandingThemeProvider>
      <Navbar />
      <main className="flex-1 relative">

        {/* 1. Abertura */}
        <section className="relative overflow-hidden border-b border-outline bg-cream py-12 sm:py-16 lg:py-20">
          <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-10 px-5 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-bold text-action shadow-sm" role="img" aria-label="Cardápio digital, pedidos na mesa e atendimento do salão">
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
                <RotatingText texts={['Cardápio digital', 'Pedidos na mesa', 'Atendimento do salão']} effect="slide" direction="up" rotationInterval={2600} splitBy="words" splitLevelClassName="overflow-hidden" mainClassName="text-action" aria-hidden="true" />
              </div>
              <h1 className="max-w-[760px] text-4xl font-black leading-[1.04] tracking-tight text-muted sm:text-6xl lg:text-7xl">Um atendimento mais organizado começa pelo <span className="rounded-sm bg-peach px-1 text-action">cardápio</span></h1>
              <p className="mt-6 max-w-[610px] text-lg font-medium leading-relaxed text-muted sm:text-xl">Com o cardap.io, seus clientes consultam o menu pelo celular e sua equipe acompanha pedidos, chamadas e solicitações de atendimento em um só lugar.</p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link href={productUrl('/cadastro')} className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-action px-7 py-3.5 text-base font-extrabold text-ink shadow-card transition-all sm:w-auto"><Sparkles className="h-5 w-5" /><span>Criar meu cardápio</span><ArrowRight className="h-5 w-5" /></Link>
                <Link href="#como-funciona" className="hero-secondary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-outline bg-white px-6 py-3 text-base font-bold text-muted transition-all hover:bg-peach sm:w-auto"><Smartphone className="h-5 w-5 text-action" /><span>Veja como funciona</span></Link>
              </div>
            </div>
            <div className="relative mx-auto flex min-h-[300px] w-full max-w-[460px] items-center justify-center sm:min-h-[390px]">
              <div className="absolute inset-[7%] rotate-[-4deg] rounded-[44%_56%_52%_48%/48%_40%_60%_52%] border border-orange-200 bg-peach/70" aria-hidden="true" />
              <Image src={LANDING_ICONS.dishPlate.src} alt="" width={520} height={520} priority className="relative z-10 w-[88%] -rotate-3 object-contain drop-shadow-sm animate-float-slow" />
              <Image src={LANDING_ICONS.drink.src} alt="" width={128} height={128} className="absolute right-0 top-2 z-20 w-20 rotate-6 object-contain drop-shadow-sm sm:right-2 sm:top-5 sm:w-28 animate-float-slow-delayed" />
            </div>
          </div>
        </section>

        <div className="border-b border-outline bg-peach py-4 sm:py-5">
          <TextLoop text="Cardápio digital Pedidos na mesa Atendimento do salão Gestão do restaurante" shape="line" speed={120} direction="forward" separator="✦" tilt={-8} fontSize={40} fontWeight={750} letterSpacing={1} ribbon ribbonColor="#FF5A36" ribbonWidth={72} edgeFade={0} cross crossAngle={17} draggable color="#120F17" pauseOnHover className="landing-text-loop mx-auto max-w-[1120px] px-5" />
        </div>

        {/* 2. Como funciona */}
        <section id="como-funciona" className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <span className="mb-3 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-bold uppercase tracking-wider text-action">Como funciona</span>
              <ScrollReveal containerClassName="text-3xl font-black tracking-tight text-muted sm:text-5xl" mode="enter" effect="rise" baseRotation={0} stagger={0.08} duration={0.65} enableBlur={false}>Do primeiro acesso ao atendimento</ScrollReveal>
            </div>
            <div className="grid grid-cols-1 gap-0 border-t border-b border-orange-200 md:grid-cols-3">
              {[
                { Icon: QrCode, title: 'O cliente abre o cardápio', text: 'Ele aponta a câmera para o QR Code ou aproxima o celular da etiqueta NFC. O menu abre no navegador, sem precisar baixar um aplicativo.' },
                { Icon: Utensils, title: 'Escolhe e envia o pedido', text: 'O cliente navega pelas categorias e envia a solicitação pelo próprio celular.' },
                { Icon: ClipboardList, title: 'Sua equipe acompanha', text: 'A equipe recebe as solicitações e dá andamento ao atendimento.' },
              ].map(({ Icon, title, text }, index) => (
                <article key={title} className="relative border-orange-200 py-7 md:px-7 md:py-8 md:first:pl-0 md:last:pr-0 md:[&:not(:last-child)]:border-r">
                  <div className="mb-5 flex items-center gap-3 text-action"><span className="font-serif text-4xl font-black">0{index + 1}</span><Icon className="h-5 w-5" aria-hidden="true" /></div>
                  <h3 className="text-lg font-black text-ink">{title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Cardápio digital e pedidos */}
        <section className="border-y border-outline bg-white py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-start gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:gap-16 lg:px-8">
            <div>
              <span className="mb-3 inline-block rounded-full bg-cream px-3 py-1 text-sm font-bold uppercase tracking-wider text-muted">Cardápio digital</span>
              <ScrollReveal containerClassName="text-3xl font-black tracking-tight text-muted sm:text-5xl" mode="enter" effect="rise" baseRotation={0} stagger={0.07} duration={0.6} enableBlur={false}>Um menu fácil de consultar e simples de atualizar</ScrollReveal>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">Organize categorias e produtos com fotos, vídeos, disponibilidade e informações que ajudam o cliente a escolher. Personalize o visual do cardápio e mantenha as opções atualizadas para quem acessa pelo celular.</p>
              <p className="mt-6 max-w-xl leading-relaxed text-muted">O cliente monta o pedido, ajusta quantidades, adiciona observações e envia pelo cardápio. A solicitação fica associada à visita da mesa para a equipe acompanhar o atendimento.</p>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">Também é possível chamar um garçom ou pedir a conta pelo celular.</p>
            </div>
            <div className="border-l-2 border-action pl-6 sm:pl-8">
              <h3 className="mb-5 text-xl font-black text-ink">Tudo o que o cliente precisa para escolher</h3>
              <ul className="space-y-4">{['Categorias e produtos organizados para celular.', 'Fotos, vídeos e informações para apresentar cada item.', 'Disponibilidade atualizada para evitar pedidos de produtos indisponíveis.'].map(text => <li key={text} className="flex items-start gap-3 text-muted"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-action"/><span>{text}</span></li>)}</ul>
              <div className="mt-8 flex items-start gap-3 border-t border-outline pt-5 text-muted"><ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-action"/><p><strong className="text-ink">Pedido associado à mesa.</strong> Produtos, quantidades e observações chegam reunidos para a equipe acompanhar.</p></div>
            </div>
          </div>
        </section>

        {/* 4. Atendimento e tempo */}
        <section id="atendimento" className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
              <div>
                <span className="mb-3 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-bold uppercase tracking-wider text-action">Atendimento do salão</span>
                <ScrollReveal containerClassName="text-3xl font-black tracking-tight text-muted sm:text-5xl" mode="enter" effect="rise" baseRotation={0} stagger={0.07} duration={0.6} enableBlur={false}>Sua equipe acompanha o que precisa de atenção</ScrollReveal>
                <p className="mt-4 leading-relaxed text-muted">Pedidos e chamadas ficam organizados em uma fila de atendimento. A equipe pode aceitar e concluir solicitações, enquanto uma tela de acompanhamento ajuda a visualizar o movimento do salão.</p>
                <p className="mt-3 leading-relaxed text-muted">Garçons e equipe acompanham as solicitações pelo celular. Uma tela na TV pode exibir a fila de atendimento do estabelecimento.</p>
              </div>
              <div className="border-y-2 border-ink bg-peach/70 px-6 py-5 sm:px-9 sm:py-7">
                <div className="mb-4 flex items-center gap-3"><Tv className="h-6 w-6 text-action"/><h3 className="text-xl font-black text-ink">Fila de atendimento</h3></div>
                <ol className="divide-y divide-orange-200">{['Pedidos', 'Chamadas de garçom', 'Pedidos de conta'].map((item, index) => <li key={item} className="flex items-center gap-4 py-3"><span className="font-serif text-2xl font-black text-action">0{index + 1}</span><span className="font-semibold text-muted">{item}</span></li>)}</ol>
              </div>
            </div>
            <div className="mt-14 grid grid-cols-1 items-start gap-4 border-t border-orange-200 pt-7 sm:grid-cols-[.65fr_1fr] sm:gap-10">
              <div><span className="text-sm font-bold uppercase tracking-wider text-action">Rotina do restaurante</span><h3 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">Mais tempo para cuidar do restaurante</h3></div>
              <div><p className="text-lg font-bold text-action">Menos tempo procurando informações. Mais tempo no salão.</p><p className="mt-3 leading-relaxed text-muted">No painel, gestores podem consultar relatórios por período ou turno e exportar os dados em CSV para acompanhar a operação.</p></div>
            </div>
          </div>
        </section>

        {/* 5. Gestão, iFood e parceiros */}
        <section className="border-y border-outline bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <span className="mb-3 inline-block rounded-full bg-cream px-3 py-1 text-sm font-bold uppercase tracking-wider text-muted">Gestão do restaurante</span>
              <ScrollReveal containerClassName="text-3xl font-black tracking-tight text-muted sm:text-5xl" mode="enter" effect="rise" baseRotation={0} stagger={0.07} duration={0.6} enableBlur={false}>Acompanhe a operação em um só lugar</ScrollReveal>
              <p className="mt-4 leading-relaxed text-muted">Gerencie mesas, cardápio e equipe pelo painel. As permissões variam conforme o perfil de acesso, para que cada pessoa encontre as ferramentas adequadas à sua função.</p>
            </div>
            <div className="landing-capabilities-marquee overflow-hidden border-y border-orange-200 py-6" aria-label="Recursos de gestão">
              <div className="landing-capabilities-track flex w-max">
                {[0, 1].map(copy => <div key={copy} className="grid grid-cols-2 gap-x-5 gap-y-4 px-5 md:grid-cols-4" aria-hidden={copy === 1 ? true : undefined}>{[
                  { Icon: Users, label: 'Mesas, cardápio e equipe' },
                  { Icon: ClipboardList, label: 'Relatórios do movimento' },
                  { Icon: PackageCheck, label: 'Estoque e fornecedores' },
                  { Icon: ShoppingBag, label: 'Compras, recebimentos e devoluções' },
                ].map(({ Icon, label }) => <div key={label} className="flex min-w-[210px] items-start gap-3 py-2 md:min-w-[250px]"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-action"/><span className="text-sm font-bold leading-relaxed text-muted">{label}</span></div>)}</div>)}
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              <article className="border-l-2 border-action pl-5 sm:pl-7"><span className="text-sm font-bold uppercase tracking-wider text-action">Integração iFood</span><h3 className="mt-2 text-xl font-black text-ink">Integração em validação</h3><p className="mt-3 leading-relaxed text-muted">A conexão de cada loja depende da validação e configuração necessárias no iFood. A disponibilidade será confirmada antes da ativação.</p></article>
              <article className="border-l-2 border-orange-200 pl-5 sm:pl-7"><span className="text-sm font-bold uppercase tracking-wider text-action">Programa de parceiros</span><h3 className="mt-2 text-xl font-black text-ink">Indique o cardap.io e acompanhe sua parceria</h3><p className="mt-3 leading-relaxed text-muted">O programa aproxima o cardap.io de profissionais e empresas que atendem restaurantes. O portal de parceiros permite acompanhar informações da parceria.</p><Link href={productUrl('/parceiros')} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-action px-5 py-2.5 font-bold text-ink">Conheça o programa<ArrowRight className="h-4 w-4"/></Link></article>
            </div>
          </div>
        </section>
        {/* 6. Prévia do sistema e demonstração */}
        <section id="sistema" className="border-y border-outline bg-cream py-16 sm:py-24">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-sm font-bold uppercase tracking-wider text-action">Prévia do sistema</span>
              <ScrollReveal containerClassName="text-3xl font-black tracking-tight text-muted sm:text-5xl" mode="enter" effect="rise" baseRotation={0} stagger={0.07} duration={0.6} enableBlur={false}>Veja como o cardap.io funciona na prática</ScrollReveal>
              <p className="mt-4 leading-relaxed text-muted">Conheça as telas de cardápio, atendimento e gestão para entender como as ferramentas se conectam à rotina do restaurante.</p>
            </div>
            <ProductPreview />
            <div className="mt-12 border-t border-orange-200 pt-10">
              <div className="mx-auto mb-6 max-w-3xl text-center">
                <span className="mb-2 inline-block text-sm font-bold uppercase tracking-wider text-action">Demonstração interativa</span>
                <p className="text-muted">Avance pelas etapas para ver como uma solicitação percorre a equipe.</p>
              </div>
              <LiveDemoSimulator compactHeader />
            </div>
          </div>
        </section>

        {/* 7. Planos */}
        <section id="planos" className="py-16 sm:py-24 max-w-[1120px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-action text-sm font-bold uppercase tracking-wider inline-block mb-3">Planos</span>
            <ScrollReveal containerClassName="text-3xl sm:text-5xl font-black text-muted tracking-tight">Escolha o plano para o momento do seu restaurante</ScrollReveal>
            <p className="text-muted mt-4 leading-relaxed">Comece organizando o cardápio e os pedidos. Quando precisar de mais recursos para o salão e para a gestão, escolha um plano mais completo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[
              {
                id: 'basic',
                name: 'Básico',
                price: 'R$ 59',
                description: 'Para organizar o cardápio digital e receber pedidos das mesas.',
                features: [
                  'Cardápio acessado por QR Code ou NFC',
                  'Modelos Cinema, Imersivo e Editorial',
                  'Cadastro de categorias e produtos',
                  'Fotos, vídeos e controle de disponibilidade dos produtos',
                  'Pedidos enviados ao painel do restaurante',
                ],
                action: 'Continuar com o Básico',
              },
              {
                id: 'essential',
                name: 'Essencial',
                price: 'R$ 79',
                description: 'Para oferecer mais opções de cardápio e acompanhar o atendimento da equipe.',
                features: [
                  'Tudo do Básico',
                  'Modelos Vitrine, Crush, Passarela, Conversas & Status e Reels',
                  'Chamadas de garçom e solicitações de conta',
                  'Fila de atendimento no celular da equipe e na TV',
                  'Relatórios por período ou turno',
                  'Exportação de relatórios em CSV',
                ],
                action: 'Continuar com o Essencial',
                featured: true,
              },
              {
                id: 'pro',
                name: 'Pro',
                price: 'R$ 149',
                description: 'Para conectar o atendimento do salão à gestão do restaurante.',
                features: [
                  'Tudo do Essencial',
                  'Controle de estoque e inventários',
                  'Cadastro e acompanhamento de fornecedores',
                  'Pedidos de compra, recebimentos e devoluções',
                ],
                action: 'Continuar com o Pro',
              },
            ].map((plan) => {
              const cardContent = <>
                <div>
                  <h3 className="text-xl font-black text-ink">{plan.name}</h3>
                  <p className="text-sm text-muted mt-2 min-h-10">{plan.description}</p>
                  <p className="mt-5 mb-6"><span className="text-4xl font-black text-ink">{plan.price}</span><span className="text-sm text-muted">/mês</span></p>
                  <ul className="space-y-3 text-sm text-muted border-t border-outline pt-6">
                    {plan.features.map((feature) => <li key={feature} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-action shrink-0 mt-0.5"/><span>{feature}</span></li>)}
                  </ul>
                </div>
                <div className="pt-8 mt-auto">
                  <Link href={planSignupUrl(plan.id as PlanId)} className={`w-full block text-center py-3.5 rounded-xl font-bold text-sm transition-colors ${plan.featured ? 'bg-action text-ink' : 'bg-cream border border-outline text-muted hover:bg-peach'}`}>
                    {plan.action}
                  </Link>
                </div>
              </>;

              const cardClass = `flex h-full w-full flex-col rounded-3xl border p-7 sm:p-8 ${plan.featured ? 'border-2 border-brand-500' : 'border-outline'}`;
              return (
                <PixelCard key={plan.name} className={`h-full w-full ${plan.featured ? 'bg-peach' : 'bg-white'}`} style={{ width: '100%', height: '100%' }} theme="light" trigger="hover" origin="pointer" intro colors={['#ffedd5', '#fdba74', '#f97316']} glowColor="#f97316" opacity={0.32} speed={79} revealDuration={800} spotlight={0.16} glow={0.4} fade={0.55} gap={7} pixelSize={4} radius={24}>
                  <article className={cardClass}>{cardContent}</article>
                </PixelCard>
              );
            })}
          </div>
        </section>

        {/* 8. Perguntas frequentes */}
        <section className="py-16 sm:py-24 bg-white border-y border-outline"><div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8"><div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-black text-muted tracking-tight">Perguntas frequentes</h2></div><div className="space-y-4">{faqs.map(({q,a})=><div key={q} className="bg-cream p-6 rounded-2xl border border-outline"><h3 className="font-bold text-muted text-base flex items-center gap-2"><HelpCircle className="w-5 h-5 text-action shrink-0"/><span>{q}</span></h3><p className="text-muted text-sm mt-2 pl-7 leading-relaxed">{a}</p></div>)}</div></div></section>

        {/* 9. Encerramento */}
        <section className="bg-peach py-16 sm:py-20 text-ink text-center relative overflow-hidden"><div className="hidden lg:block absolute -bottom-6 left-8 pointer-events-none select-none animate-float-slow" style={{'--scenery-rot':'-10deg'} as React.CSSProperties} aria-hidden="true"><div className="w-24 h-24 relative filter drop-shadow-xl"><Image src={LANDING_ICONS.chef.src} alt="" width={96} height={96} className="object-contain"/></div></div><div className="hidden lg:block absolute -top-4 right-10 pointer-events-none select-none animate-float-slow-delayed" style={{'--scenery-rot':'12deg'} as React.CSSProperties} aria-hidden="true"><div className="w-24 h-24 relative filter drop-shadow-xl"><Image src={LANDING_ICONS.menu.src} alt="" width={96} height={96} className="object-contain"/></div></div><div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 space-y-6 relative z-10"><h2 className="text-3xl sm:text-5xl font-black tracking-tight">Organize o atendimento do seu restaurante com o cardap.io</h2><p className="text-muted text-lg max-w-2xl mx-auto">Cardápio digital, pedidos, chamadas e ferramentas de gestão reunidos para apoiar a rotina da sua equipe.</p><div className="pt-2"><Link href={productUrl('/cadastro')} className="inline-flex items-center gap-2 bg-white text-muted hover:bg-cream font-black text-base px-8 py-4 rounded-2xl shadow-card transition-all"><Sparkles className="w-5 h-5 text-action"/><span>Criar conta e escolher plano</span><ArrowRight className="w-5 h-5"/></Link></div></div></section>
      </main>
      <Footer />
    </LandingThemeProvider>
  );
}
