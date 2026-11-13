'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Smartphone, Bell, CheckCircle2, QrCode, Wifi, Clock, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { LANDING_ICONS } from '@/lib/landing-assets';
import SwipeToast from '@/components/public/react-bits/SwipeToast';

export default function LiveDemoSimulator({ compactHeader = false }: { compactHeader?: boolean }) {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(current => current < 4 ? current + 1 : 1);
  };

  return (
    <div id="simulador" className="bg-peach rounded-3xl p-5 sm:p-8 lg:p-10 border border-outline text-ink shadow-card relative">
      {/* Background glow */}


      {/* Header */}
      {!compactHeader && <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="px-3.5 py-1.5 rounded-full bg-action text-ink font-bold text-sm uppercase tracking-wider inline-block mb-3 border border-brand-500/30">
          Prévia do sistema
        </span>
        <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-ink">
          Veja como o <span className="text-action">cardap.io</span> funciona na prática
        </h3>
        <p className="text-muted text-sm sm:text-base mt-2">
          Conheça as telas de cardápio, atendimento e gestão para entender como as ferramentas se conectam à rotina do restaurante.
        </p>
      </div>}

      {/* Steps timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6 sm:mb-8">
        {[
          { num: 1, title: '1. Cardápio aberto', desc: 'QR Code ou NFC' },
          { num: 2, title: '2. Pedido enviado', desc: 'Associado à mesa' },
          { num: 3, title: '3. Equipe acompanha', desc: 'Fila de solicitações' },
          { num: 4, title: '4. Atendimento concluído', desc: 'Pedido ou chamada' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            aria-pressed={step === s.num}
            onClick={() => setStep(s.num)}
            className={`min-w-0 p-3 sm:p-4 rounded-2xl text-left border transition-colors ${
              step === s.num
                ? 'bg-white border-action text-ink shadow-card'
                : 'bg-white/70 border-orange-200 text-muted hover:bg-peach'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${step === s.num ? 'bg-action text-ink' : 'bg-peach text-muted'}`}>
                Passo {s.num}
              </span>
              {step > s.num && <CheckCircle2 className="w-4 h-4 text-action" />}
            </div>
            <p className="mt-2 break-words text-sm font-bold leading-snug text-ink">{s.title}</p>
            <p className="text-xs sm:text-sm text-muted">{s.desc}</p>
          </button>
        ))}
      </div>

      {/* Interactive Display Area */}
      <div role="tabpanel" aria-live="polite" className="bg-white/80 rounded-2xl p-4 sm:p-8 border border-outline min-h-[340px] sm:min-h-[380px] flex flex-col justify-center items-center relative">
        {step === 1 && (
          <div className="text-center max-w-md animate-fadeIn space-y-5">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-white border border-outline shadow-card p-2 flex items-center justify-center">
              <Image
                src={LANDING_ICONS.smartphone.src}
                alt={LANDING_ICONS.smartphone.alt}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-action text-sm font-semibold mb-2">
                <Wifi className="w-3.5 h-3.5" />
                <span>Cardápio digital</span>
              </div>
              <h4 className="text-xl font-black text-ink">Mesa 04 • Salão Principal</h4>
              <p className="text-sm text-muted mt-1">
                O cliente aponta a câmera para o QR Code ou aproxima o celular da etiqueta NFC. O menu abre no navegador, sem precisar baixar um aplicativo.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setStep(2)}
                className="bg-action hover:bg-action-hover text-ink font-bold px-6 py-3 rounded-xl shadow-card flex items-center gap-2 text-sm"
              >
                <Bell className="w-4 h-4" />
                <span>Escolher produtos</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center max-w-lg animate-fadeIn space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-action text-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-action"></span>
              PEDIDO ASSOCIADO À MESA
            </div>

              <div className="bg-white border-2 border-orange-200 rounded-2xl p-4 sm:p-6 text-left shadow-card relative overflow-hidden">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200/50 p-1 flex items-center justify-center shrink-0">
                    <Image
                      src={LANDING_ICONS.bell.src}
                      alt={LANDING_ICONS.bell.alt}
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-action">Pedido enviado</span>
                    <h4 className="text-2xl font-black text-ink">Mesa 04</h4>
                    <p className="text-xs text-muted">Solicitação para a equipe</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-action font-mono font-black text-base sm:text-lg">
                    <Clock className="w-5 h-5" />
                    <span>Em andamento</span>
                  </div>
                  <span className="text-xs text-muted">acompanhamento</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted">
              Pedidos e chamadas aparecem na fila para a equipe acompanhar e atender.
            </p>

            <button
              onClick={() => setStep(3)}
              className="bg-action hover:bg-action-hover text-ink font-bold px-6 py-3 rounded-xl shadow-card flex items-center gap-2 text-sm mx-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Equipe acompanha a solicitação</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center max-w-md animate-fadeIn space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-outline shadow-card p-2 flex items-center justify-center">
              <Image
                src={LANDING_ICONS.chef.src}
                alt={LANDING_ICONS.chef.alt}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-action text-sm font-semibold mb-2">
                <span>Solicitação em acompanhamento</span>
              </div>
              <h4 className="text-xl font-black text-ink">Atendimento do salão</h4>
              <div className="p-4 bg-white border border-outline rounded-xl mt-3 text-left shadow-sm">
                <p className="text-sm font-bold text-muted">Solicitação da mesa:</p>
                <p className="text-sm text-muted font-medium mt-1">
                  "Equipe acompanha o pedido enviado."
                </p>
              </div>
            </div>

            <p className="text-sm text-muted">
              A equipe pode aceitar e concluir as solicitações de atendimento.
            </p>

            <button
              onClick={() => setStep(4)}
              className="bg-action hover:bg-action-hover text-ink font-bold px-6 py-3 rounded-xl shadow-card text-sm mx-auto flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Acompanhar a solicitação</span>
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center max-w-md animate-fadeIn space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-outline shadow-card p-2 flex items-center justify-center">
              <Image
                src={LANDING_ICONS.dishPlate.src}
                alt={LANDING_ICONS.dishPlate.alt}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>

            <div>
              <h4 className="text-2xl font-black text-ink">Solicitações reunidas em um só lugar</h4>
              <p className="text-sm text-muted mt-2">
                A equipe acompanha pedidos, chamadas de garçom e pedidos de conta em uma fila de atendimento.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-peach rounded-xl border border-outline text-left">
              <div>
                <span className="text-sm text-muted">Acompanhamento:</span>
              <p className="text-base font-bold text-action">Fila de atendimento</p>
              </div>
              <div>
                <span className="text-sm text-muted">Solicitações:</span>
                <p className="text-base font-bold text-action">Pedidos e chamadas</p>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-action hover:text-action font-bold text-sm underline pt-2 block mx-auto"
            >
              Reiniciar Simulação
            </button>
          </div>
        )}
      </div>

      {step === 4 && <div className="mt-4 flex justify-center sm:justify-end"><SwipeToast inline open title="Demonstração concluída" description="Você viu o fluxo de atendimento." background="#25211E" color="#FFF8F0" fuseColor="#F97316" duration={0} dismissible closeButton pauseOnHover /></div>}

      {/* Bottom Controls */}
      <div className="mt-6 flex justify-between items-center text-sm text-muted">
        <span>Etapa {step} de 4</span>
        <button
          onClick={handleNext}
          className="text-action hover:text-action font-bold flex items-center gap-1"
        >
          <span>{step === 4 ? 'Voltar ao início' : 'Próxima etapa'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
