'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import LiveDemoSimulator from '@/components/public/LiveDemoSimulator';
import RoiCalculator from '@/components/public/RoiCalculator';
import ProductPreview from '@/components/public/ProductPreview';
import LandingBackgroundScenery from '@/components/public/LandingBackgroundScenery';
import { LANDING_ICONS } from '@/lib/landing-assets';
import { productUrl } from '@/lib/product-url';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Wifi,
  QrCode,
  Smartphone,
  Tv,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Play,
  HelpCircle,
  Star
} from 'lucide-react';

export default function HomePage() {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <div className="presentation-theme home-theme min-h-screen bg-cream flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 relative">
        {/* Composição Cênica Despojada de Background */}
        <LandingBackgroundScenery />

        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-24 bg-transparent border-b border-outline">

          <div className="max-w-[1120px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-action border border-orange-200 text-sm sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-action" />
                <span>Um toque aproxima seu restaurante do cliente</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-muted tracking-tight leading-[1.08]">
                Escaneou. Chamou.{' '}
                <span className="text-action bg-peach">
                  Chegou.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto font-medium leading-relaxed">
                Seu cardápio, seus pratos e sua equipe mais perto do cliente. Com QR Code e NFC, o atendimento começa na mesa.
              </p>

              {/* CTA buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={productUrl('/cadastro')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-action text-ink font-extrabold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-card transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Criar meu cardápio</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href={productUrl('/m/v1-anfc-mesa04-eWLauJ46')}
                  target="_blank"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-cream text-muted font-bold text-base px-6 py-4 rounded-full border border-outline shadow-sm transition-all"
                >
                  <Smartphone className="w-5 h-5 text-action" />
                  <span>Ver demonstração</span>
                </Link>
              </div>

              {/* Micro-assurances */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-sm sm:text-sm font-semibold text-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Sem baixar nenhum aplicativo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Funciona em qualquer smartphone</span>
                </div>
              </div>
            </div>

            <ProductPreview />

            {/* Quick Live Preview Cards */}
            <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-outline shadow-card transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-action flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="font-black text-ink text-lg">NFC & QR Code Dinâmico</h3>
                <p className="text-muted text-sm mt-1 leading-relaxed">
                  Adesivos programáveis NTAG213/215 ou displays de acrílico elegantes com tokens de segurança exclusivos.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-outline shadow-card transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-peach text-action flex items-center justify-center mb-4 border border-outline/30">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-black text-ink text-lg">Fila com Cronômetro</h3>
                <p className="text-muted text-sm mt-1 leading-relaxed">
                  Ordem de chamada com contagem de segundos (ex: 00:04s, 00:24s), garantindo atendimento justo e sem estresse.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-outline shadow-card transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-black text-ink text-lg">Validação Wi-Fi Anti-Trotes</h3>
                <p className="text-muted text-sm mt-1 leading-relaxed">
                  Captura do IP da sua rede em 1 clique. Ninguém de fora do seu restaurante consegue chamar sua equipe por engano.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SIMULATOR */}
        <section className="py-16 sm:py-24 max-w-[1120px] mx-auto px-5 sm:px-6 lg:px-8">
          <LiveDemoSimulator />
        </section>

        {/* ANTES VS DEPOIS COMPARISON TABLE */}
        <section className="py-16 sm:py-24 bg-white border-y border-outline">
          <div className="max-w-[1120px] mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3 py-1 rounded-full bg-cream text-muted text-sm font-bold uppercase tracking-wider inline-block mb-3">
                Comparativo Operacional de Salão
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-muted tracking-tight">
                Mais clareza para sua equipe. Mais atenção com <span className="text-action">Anfc Cardapios</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Operação Tradicional */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-muted">Operação Tradicional (Antes)</h3>
                    <p className="text-sm text-red-600 font-bold uppercase">Ruídos, estresse e lentidão</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-red-100 shadow-sm">
                    <p className="font-bold text-muted text-sm">Cliente procurando o garçom</p>
                    <p className="text-sm text-muted mt-1">
                      Levantar as mãos, assobiar, estalar dedos ou esperar minutos com raiva até ser notado no salão cheio.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-red-100 shadow-sm">
                    <p className="font-bold text-muted text-sm">Equipe desorientada</p>
                    <p className="text-sm text-muted mt-1">
                      Garçons não sabem qual mesa chamou primeiro, atendem fora de ordem e geram atritos e reclamações.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-red-100 shadow-sm">
                    <p className="font-bold text-muted text-sm">Demora para fechar a conta</p>
                    <p className="text-sm text-muted mt-1">
                      Garçom vai à mesa perguntar a forma de pagamento, volta ao caixa, busca a maquininha e retorna. Perda de 15 a 20 minutos por mesa.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-red-100 shadow-sm">
                    <p className="font-bold text-muted text-sm">Zero controle gerencial</p>
                    <p className="text-sm text-muted mt-1">
                      O dono não sabe quanto tempo os clientes esperaram nem a produtividade de cada atendente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Operação com Anfc Cardapios */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-muted">Com o Anfc Cardapios (Depois)</h3>
                    <p className="text-sm text-emerald-600 font-bold uppercase">Atendimento em segundos & alto giro</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-sm">
                    <p className="font-bold text-muted text-sm text-emerald-800">Chamado em 1 toque NFC / QR</p>
                    <p className="text-sm text-muted mt-1 leading-relaxed">
                      Aproximação instantânea do celular ou leitura de QR. Chamado acionado em 1 segundo com feedback em tempo real.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-sm">
                    <p className="font-bold text-muted text-sm text-emerald-800">Fila com cronômetro progressivo</p>
                    <p className="text-sm text-muted mt-1 leading-relaxed">
                      Chamados visíveis na TV e celulares da equipe com tempo exato de espera (00:04s, 00:24s). Ordem justa e transparente.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-sm">
                    <p className="font-bold text-muted text-sm text-emerald-800">Pedido de conta pelo celular</p>
                    <p className="text-sm text-muted mt-1 leading-relaxed">
                      Cliente escolhe Pix, Cartão ou Dinheiro. O garçom já vai direto com a maquininha correta, liberando a mesa imediatamente.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-sm">
                    <p className="font-bold text-muted text-sm text-emerald-800">Métricas completas e PIN de salão</p>
                    <p className="text-sm text-muted mt-1 leading-relaxed">
                      Tempo Médio de Resposta (TMR) monitorado minuto a minuto. Rastreabilidade total de quem atendeu cada mesa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI CALCULATOR SECTION */}
        <section className="py-16 sm:py-24 max-w-[1120px] mx-auto px-5 sm:px-6 lg:px-8">
          <RoiCalculator />
        </section>

        {/* PRICING PLANS SECTION */}
        <section id="planos" className="py-16 sm:py-24 bg-white border-t border-outline">
          <div className="max-w-[1120px] mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="px-3.5 py-1.5 rounded-full bg-orange-100 text-action font-bold text-sm uppercase tracking-wider inline-block mb-3">
                Preços Claros e Transparentes
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-muted tracking-tight">
                Planos simples que cabem no bolso do seu restaurante
              </h2>
              <p className="text-muted text-base mt-3">
                Todos os novos cadastros começam com <strong>10 dias grátis</strong> de todos os recursos do plano Pro, sem necessidade de cartão de crédito.
              </p>

              {/* Billing Cycle Toggle */}
              <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-cream border border-outline">
                <button
                  onClick={() => setAnnualBilling(false)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    !annualBilling ? 'bg-white text-muted shadow-sm' : 'text-muted hover:text-muted'
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setAnnualBilling(true)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                    annualBilling ? 'bg-action text-ink shadow-sm' : 'text-muted hover:text-muted'
                  }`}
                >
                  <span>Anual</span>
                  <span className="text-sm bg-white/20 px-1.5 py-0.5 rounded-full">2 meses grátis</span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Essencial */}
              <div className="bg-cream rounded-3xl p-8 border border-outline flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-muted">Essencial</h3>
                  <p className="text-sm text-muted mt-1">Para bares e cafeterias de pequeno porte</p>
                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-black text-muted">
                      R$ {annualBilling ? '49,92' : '59,90'}
                    </span>
                    <span className="text-sm text-muted">/mês</span>
                    {annualBilling && (
                      <p className="text-sm text-emerald-600 font-bold mt-1">Faturado R$ 599,00 anualmente</p>
                    )}
                  </div>

                  <ul className="space-y-3 text-sm sm:text-sm text-muted border-t border-outline pt-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Até <strong>20 mesas</strong> cadastradas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Até <strong>5 garçons/usuários</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Chamados em tempo real & Modo TV</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Cardápio digital com fotos em HD</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Validação Wi-Fi anti-trotes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Até 2 botões customizados</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={productUrl('/cadastro?plano=essential')}
                    className="w-full block text-center py-3.5 rounded-xl font-bold text-sm bg-white border border-outline text-muted hover:bg-cream transition-colors"
                  >
                    Começar no Essencial
                  </Link>
                </div>
              </div>

              {/* Pro (Mais Popular) */}
              <div className="bg-peach rounded-3xl p-8 border-2 border-brand-500 text-ink flex flex-col justify-between shadow-card relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-action text-ink text-sm font-black uppercase px-4 py-1 rounded-full shadow-card">
                  MAIS POPULAR • 10 DIAS GRÁTIS
                </div>

                <div>
                  <h3 className="text-xl font-black text-ink">Pro</h3>
                  <p className="text-sm text-muted mt-1">Para restaurantes, hamburguerias e pizzarias</p>
                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-black text-ink">
                      R$ {annualBilling ? '83,25' : '99,90'}
                    </span>
                    <span className="text-sm text-muted">/mês</span>
                    {annualBilling && (
                      <p className="text-sm text-emerald-700 font-bold mt-1">Faturado R$ 999,00 anualmente</p>
                    )}
                  </div>

                  <ul className="space-y-3 text-sm sm:text-sm text-muted border-t border-outline pt-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-action shrink-0" />
                      <span>Até <strong>50 mesas</strong> cadastradas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-action shrink-0" />
                      <span><strong>Equipe ilimitada</strong> com PIN individual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-action shrink-0" />
                      <span><strong>Vídeos Reels dos pratos</strong> no cardápio</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-action shrink-0" />
                      <span>Botões customizados <strong>ilimitados</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-action shrink-0" />
                      <span>Relatórios avançados e TMR de salão</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-action shrink-0" />
                      <span>Suporte prioritário via WhatsApp</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={productUrl('/cadastro?plano=pro')}
                    className="w-full block text-center py-4 rounded-xl font-extrabold text-sm bg-action text-ink shadow-card transition-all"
                  >
                    Testar 10 Dias Grátis Agora
                  </Link>
                </div>
              </div>

              {/* Business */}
              <div className="bg-cream rounded-3xl p-8 border border-outline flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-muted">Business</h3>
                  <p className="text-sm text-muted mt-1">Grandes operações, lounges e franquias</p>
                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-black text-muted">
                      R$ {annualBilling ? '166,58' : '199,90'}
                    </span>
                    <span className="text-sm text-muted">/mês</span>
                    {annualBilling && (
                      <p className="text-sm text-emerald-600 font-bold mt-1">Faturado R$ 1.999,00 anualmente</p>
                    )}
                  </div>

                  <ul className="space-y-3 text-sm sm:text-sm text-muted border-t border-outline pt-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Até <strong>100 mesas</strong> cadastradas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Múltiplos ambientes e setores</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Exportação completa de relatórios</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Prioridade máxima no WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Acesso antecipado a novos recursos</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={productUrl('/cadastro?plano=business')}
                    className="w-full block text-center py-3.5 rounded-xl font-bold text-sm bg-white border border-outline text-muted hover:bg-cream transition-colors"
                  >
                    Começar no Business
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href={productUrl('/recursos')}
                className="inline-flex items-center gap-2 text-sm font-bold text-action hover:text-action"
              >
                <span>Comparar todos os recursos dos planos</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 sm:py-24 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-muted tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="text-muted text-sm mt-2">
              Tire todas as suas dúvidas sobre a operação do Anfc Cardapios no seu restaurante.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'O cliente precisa baixar algum aplicativo?',
                a: 'Não! O cliente simplesmente aproxima o celular da tag NFC ou aponta a câmera para o QR Code na mesa. O navegador abre instantaneamente em menos de 1 segundo.',
              },
              {
                q: 'Como funciona a proteção contra trotes de pessoas fora do restaurante?',
                a: 'O Anfc Cardapios possui validação de IP e Wi-Fi inteligente. O painel captura o IP da rede do seu restaurante em 1 clique. Se alguém tentar acionar botões restritos sem estar conectado ao seu Wi-Fi, o chamado é bloqueado preventivamente.',
              },
              {
                q: 'Como os garçons atendem aos chamados?',
                a: 'A equipe utiliza o próprio smartphone ou telas instaladas no salão. Cada garçom tem um PIN de 4 dígitos. Ao tocar em "Assumir Mesa", o cliente é notificado na hora e o chamado sai da fila dos outros garçons.',
              },
              {
                q: 'Como funciona a gravação das tags NFC?',
                a: 'Direto pelo painel do Anfc Cardapios no celular do administrador! Basta clicar no botão "Gravar NFC" ao lado da mesa e encostar a tag no celular para programá-la com o token de segurança daquela mesa.',
              },
              {
                q: 'Como funciona o teste de 10 dias grátis?',
                a: 'Ao criar sua conta, você recebe imediatamente 10 dias com todos os recursos do plano Pro liberados. Não pedimos cartão de crédito. Se quiser continuar após os 10 dias, basta escolher seu plano.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-outline">
                <h4 className="font-bold text-muted text-base flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-action shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-muted text-sm mt-2 pl-7 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-peach py-16 text-ink text-center relative overflow-hidden">
          {/* Ambient Scenery: Props nos cantos do CTA */}
          <div
            className="hidden lg:block absolute -bottom-6 left-8 pointer-events-none select-none animate-float-slow"
            style={{ '--scenery-rot': '-10deg' } as React.CSSProperties}
            aria-hidden="true"
          >
            <div className="w-24 h-24 relative filter drop-shadow-xl">
              <Image
                src={LANDING_ICONS.chef.src}
                alt=""
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="hidden lg:block absolute -top-4 right-10 pointer-events-none select-none animate-float-slow-delayed"
            style={{ '--scenery-rot': '12deg' } as React.CSSProperties}
            aria-hidden="true"
          >
            <div className="w-24 h-24 relative filter drop-shadow-xl">
              <Image
                src={LANDING_ICONS.menu.src}
                alt=""
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Pronto para transformar o atendimento do seu salão?
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Crie seu cardápio, organize suas mesas e experimente o atendimento conectado. Você tem 10 dias grátis para conhecer o sistema.
            </p>
            <div className="pt-2">
              <Link
                href={productUrl('/cadastro')}
                className="inline-flex items-center gap-2 bg-white text-muted hover:bg-cream font-black text-base px-8 py-4 rounded-2xl shadow-card transition-all"
              >
                <Sparkles className="w-5 h-5 text-action" />
                <span>Ativar Meus 10 Dias Grátis Agora</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
