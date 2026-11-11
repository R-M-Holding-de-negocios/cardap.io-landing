'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, Users } from 'lucide-react';

export default function RoiCalculator() {
  const [tables, setTables] = useState(25);
  const [avgTicket, setAvgTicket] = useState(85);
  const [dailyTurns, setDailyTurns] = useState(2.5);

  // Math: 12 minutes saved per table closure allows an estimated +15% more table turnover on peak hours
  const monthlyClients = Math.round(tables * dailyTurns * 30);
  const monthlyRevenue = monthlyClients * avgTicket;
  const estimatedTurnoverIncrease = 0.16; // 16% extra turnover
  const extraMonthlyRevenue = Math.round(monthlyRevenue * estimatedTurnoverIncrease);
  const timeSavedHoursMonth = Math.round((monthlyClients * 12) / 60);

  return (
    <div id="calculadora" className="bg-white rounded-3xl p-6 sm:p-10 border border-outline shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-outline">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-action text-sm font-bold mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Giro de Salão</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-muted tracking-tight">
            Quanto o <span className="text-action">Anfc Cardapios</span> gera a mais no seu caixa?
          </h3>
          <p className="text-sm text-muted mt-1">
            Explore uma estimativa com os dados do seu salão. A simulação usa hipóteses de giro e tempo de atendimento; os resultados reais podem variar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mesas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-muted flex items-center gap-2">
                <Users className="w-4 h-4 text-action" />
                Número de Mesas no Salão
              </label>
              <span className="text-base font-black text-action bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                {tables} mesas
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={tables}
              onChange={(e) => setTables(Number(e.target.value))}
              className="w-full h-2.5 bg-white rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-sm text-muted mt-1">
              <span>5 mesas</span>
              <span>50 mesas</span>
              <span>100 mesas</span>
            </div>
          </div>

          {/* Ticket Médio */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-muted flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-action" />
                Ticket Médio por Mesa
              </label>
              <span className="text-base font-black text-action bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                R$ {avgTicket},00
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="250"
              step="5"
              value={avgTicket}
              onChange={(e) => setAvgTicket(Number(e.target.value))}
              className="w-full h-2.5 bg-white rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-sm text-muted mt-1">
              <span>R$ 30</span>
              <span>R$ 140</span>
              <span>R$ 250</span>
            </div>
          </div>

          {/* Giros por dia */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-muted flex items-center gap-2">
                <Clock className="w-4 h-4 text-action" />
                Giro Médio (Atendimentos por mesa/dia)
              </label>
              <span className="text-base font-black text-action bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                {dailyTurns}x por dia
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="0.5"
              value={dailyTurns}
              onChange={(e) => setDailyTurns(Number(e.target.value))}
              className="w-full h-2.5 bg-white rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-sm text-muted mt-1">
              <span>1x (Lento)</span>
              <span>3x (Médio)</span>
              <span>6x (Alta rotatividade)</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 bg-peach rounded-2xl p-6 sm:p-8 text-ink border border-outline shadow-card space-y-6">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Retorno Mensal Projetado</span>
          </div>

          <div>
            <span className="text-sm text-muted">Potencial de Faturamento Adicional:</span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 mt-1">
              + R$ {extraMonthlyRevenue.toLocaleString('pt-BR')},00
              <span className="text-sm font-medium text-muted block mt-0.5">/mês em mesas adicionais</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline text-sm">
            <div>
              <span className="text-muted">Tempo de salão poupado:</span>
              <p className="text-base font-black text-ink mt-0.5">{timeSavedHoursMonth} horas/mês</p>
            </div>
            <div>
              <span className="text-muted">Investimento Pro:</span>
              <p className="text-base font-black text-action mt-0.5">R$ 99,90/mês</p>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-sm text-muted">
            💡 O Anfc Cardapios se paga em menos de <strong>1 dia de salão</strong> apenas pelo ganho de velocidade no fechamento de contas.
          </div>
        </div>
      </div>
    </div>
  );
}
