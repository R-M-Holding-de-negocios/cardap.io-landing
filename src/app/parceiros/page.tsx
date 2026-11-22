'use client';

import React, { useState } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calculator,
  Gift
} from 'lucide-react';
import Link from 'next/link';
import PartnerApplicationConfirmation from '@/components/public/PartnerApplicationConfirmation';

export default function ParceirosPage() {
  const [restaurantsReferred, setRestaurantsReferred] = useState(15);
  const avgPlanPrice = 149;

  const monthlyCommission = Math.round(restaurantsReferred * avgPlanPrice * 0.20 * 100) / 100;
  const annualCommission = monthlyCommission * 12;
  const money = (amount: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPix, setFormPix] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setApplicationError(null);
    try {
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formName,
          email: formEmail,
          pixKey: formPix,
          whatsapp: formWhatsapp,
          password: formPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.status === 'pending' && typeof data.applicationId === 'string') setApplicationId(data.applicationId);
      else setApplicationError(data.error || 'Não foi possível registrar a candidatura. Tente novamente.');
    } catch (err) {
      setApplicationError('Falha de conexão. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="presentation-theme min-h-screen bg-cream flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-16 pb-20 bg-peach border-b border-outline">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-sm uppercase tracking-wider inline-block">
              Programa Oficial de Afiliados
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-muted tracking-tight leading-tight">
              Indique restaurantes e acompanhe <span className="text-action">suas comissões</span>
            </h1>
            <p className="text-base sm:text-xl text-muted max-w-2xl mx-auto">
              Indique o Cardap.io para bares, restaurantes e cafeterias. Acompanhe comissões sobre pagamentos recebidos no seu painel após a aprovação da candidatura.
            </p>
            <div className="pt-2">
              <a
                href="#cadastro-parceiro"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-action hover:bg-action-hover text-ink font-black text-base shadow-card transition-all"
              >
                <span>Cadastrar-se Gratuitamente</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-outline shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-muted">Comissões sobre pagamentos recebidos</h3>
              <p className="text-sm text-muted leading-relaxed">
                Você recebe 20% do valor líquido de cada pagamento elegível enquanto o restaurante indicado continuar pagando. Não há limite fixo de meses.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-outline shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-action flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-muted">Acompanhamento das comissões</h3>
              <p className="text-sm text-muted leading-relaxed">
                As comissões registradas aparecem no portal após a confirmação do pagamento. Os repasses dependem de validação operacional das condições do programa: dois restaurantes distintos aprovados e pagos e 7 dias de conferência para cada comissão. O cancelamento nos primeiros 7 dias elimina a comissão daquele pagamento, mesmo sem reembolso ao restaurante.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-outline shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-muted">Painel Exclusivo de Rastreio</h3>
              <p className="text-sm text-muted leading-relaxed">
                Link e código de indicação para acompanhar os restaurantes que se cadastrarem pelo programa.
              </p>
            </div>
          </div>
        </section>

        {/* Simulador de Ganhos */}
        <section className="py-16 bg-white border-y border-outline">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="bg-peach rounded-3xl p-8 sm:p-12 text-ink border border-outline shadow-card space-y-8">
              <div className="text-center space-y-2">
                <span className="text-sm font-bold uppercase tracking-wider text-action">
                  Simulador de Renda Recorrente
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-ink">
                  Quanto você pode ganhar todo mês?
                </h2>
                <p className="text-sm text-muted">
                  Arraste para simular o número de restaurantes da sua região usando o Cardap.io.
                </p>
                <p className="text-sm text-muted">Exemplo com plano Pro de R$ 149 por mês. A simulação usa 20% do preço antes das taxas; a comissão real usa o valor líquido recebido e pode ser menor. O repasse exige dois restaurantes válidos e ocorre após 7 dias de conferência de cada pagamento.</p>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>Restaurantes Ativos Indicados:</span>
                  <span className="text-xl font-black text-action bg-white/10 px-4 py-1 rounded-xl">
                    {restaurantsReferred} estabelecimentos
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="80"
                  step="1"
                  value={restaurantsReferred}
                  onChange={(e) => setRestaurantsReferred(Number(e.target.value))}
                  className="w-full h-3 bg-peach rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              {/* Commission Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-outline text-center">
                <div className="p-6 bg-peach rounded-2xl border border-outline">
                  <span className="text-sm text-muted uppercase font-bold">Comissão mensal estimada:</span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-700 mt-1">
                    {money(monthlyCommission)}
                    <span className="text-sm text-muted font-normal block">/mês neste cenário simulado</span>
                  </div>
                </div>

                <div className="p-6 bg-peach rounded-2xl border border-outline">
                  <span className="text-sm text-muted uppercase font-bold">Estimativa em 12 meses:</span>
                  <div className="text-3xl sm:text-4xl font-black text-action mt-1">
                    {money(annualCommission)}
                    <span className="text-sm text-muted font-normal block">se houver 12 pagamentos por indicação, antes das taxas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cadastro Form Section */}
        <section id="cadastro-parceiro" className="py-20 max-w-xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 border border-outline shadow-card space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-muted">Inscreva-se como Parceiro Oficial</h3>
              <p className="text-sm text-muted">
                Envie sua candidatura. Após a análise e aprovação, seu link de indicação ficará disponível no portal.
              </p>
            </div>

            {applicationId ? (
              <PartnerApplicationConfirmation applicationId={applicationId} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {applicationError && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">{applicationError}</p>}
                <div>
                  <label className="text-sm font-bold text-muted block mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline text-sm text-muted focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-muted block mb-1">E-mail</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline text-sm text-muted focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-muted block mb-1">Chave Pix para Recebimento</label>
                  <input
                    type="text"
                    value={formPix}
                    onChange={(e) => setFormPix(e.target.value)}
                    placeholder="CPF, CNPJ, E-mail, Celular ou Chave Aleatória"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline text-sm text-muted focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-muted block mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline text-sm text-muted focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <label className="block text-sm font-bold text-muted">Senha para o portal do afiliado
                  <input type="password" autoComplete="new-password" minLength={12} maxLength={72} required value={formPassword} onChange={e=>setFormPassword(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-outline text-sm text-muted" />
                  <span className="mt-1 block text-xs font-normal">Use ao menos 12 caracteres. O acesso será liberado após aprovação.</span>
                </label>

                <div className="p-3 bg-cream rounded-xl border border-outline text-sm text-muted leading-relaxed">
                  🛡️ <strong>Regra Anti-Fraude:</strong> É terminantemente proibida a autoindicação direta ou indireta de restaurantes pertencentes ao próprio parceiro.
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-action hover:bg-action-hover text-ink font-extrabold text-sm shadow-card transition-all"
                >
                  {submitting ? 'Enviando candidatura...' : 'Enviar candidatura de parceiro'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
