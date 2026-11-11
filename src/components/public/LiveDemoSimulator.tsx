'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Smartphone, Bell, CheckCircle2, QrCode, Wifi, Clock, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { LANDING_ICONS } from '@/lib/landing-assets';

export default function LiveDemoSimulator() {
  const [step, setStep] = useState(1);
  const [seconds, setSeconds] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (step === 2) {
      timer = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      if (step === 1) setSeconds(4);
    } else {
      setStep(1);
      setSeconds(4);
    }
  };

  return (
    <div id="simulador" className="bg-peach rounded-3xl p-6 sm:p-10 border border-outline text-ink shadow-card relative overflow-hidden">
      {/* Background glow */}


      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="px-3.5 py-1.5 rounded-full bg-action text-ink font-bold text-sm uppercase tracking-wider inline-block mb-3 border border-brand-500/30">
          Simulador Interativo em 4 Etapas
        </span>
        <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-ink">
          Veja a mágica do <span className="text-action">Anfc Cardapios</span> em ação
        </h3>
        <p className="text-muted text-sm sm:text-base mt-2">
          Experimente como a experiência flui da mesa do cliente até o smartphone do garçom e o painel de salão.
        </p>
      </div>

      {/* Steps timeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { num: 1, title: '1. Leitura NFC / QR', desc: 'Cliente na mesa' },
          { num: 2, title: '2. Fila em Tempo Real', desc: 'Cronômetro ativo' },
          { num: 3, title: '3. Garçom Assume', desc: 'Agilidade via PIN' },
          { num: 4, title: '4. Mesa Atendida', desc: 'Giro acelerado' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => {
              setStep(s.num);
              if (s.num === 2) setSeconds(4);
            }}
            className={`p-3 rounded-2xl text-left border transition-all ${
              step === s.num
                ? 'bg-white border-action text-ink shadow-card'
                : 'bg-peach border-outline text-muted hover:bg-peach'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${step === s.num ? 'bg-action text-ink' : 'bg-peach text-muted'}`}>
                Passo {s.num}
              </span>
              {step > s.num && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
            </div>
            <p className="text-sm sm:text-sm font-bold text-ink mt-2">{s.title}</p>
            <p className="text-sm text-muted">{s.desc}</p>
          </button>
        ))}
      </div>

      {/* Interactive Display Area */}
      <div className="bg-peach rounded-2xl p-6 sm:p-8 border border-outline min-h-[380px] flex flex-col justify-center items-center relative">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 text-sm font-semibold mb-2">
                <Wifi className="w-3.5 h-3.5" />
                <span>Wi-Fi Reconhecido • Presença Confirmada</span>
              </div>
              <h4 className="text-xl font-black text-ink">Mesa 04 • Salão Principal</h4>
              <p className="text-sm text-muted mt-1">
                O cliente apenas aproxima o smartphone da tag NFC na mesa ou aponta a câmera para o QR Code. Zero download, zero cadastro.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setStep(2)}
                className="bg-action hover:bg-action-hover text-ink font-bold px-6 py-3 rounded-xl shadow-card flex items-center gap-2 text-sm"
              >
                <Bell className="w-4 h-4" />
                <span>Tocar em "Chamar Garçom"</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center max-w-lg animate-fadeIn space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-700 text-sm font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              NOVO CHAMADO NA FILA OPERACIONAL
            </div>

            <div className="bg-white border-2 border-rose-500/60 rounded-2xl p-6 text-left shadow-card relative overflow-hidden">
              <div className="flex justify-between items-start">
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
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Chamando Garçom</span>
                    <h4 className="text-2xl font-black text-ink">Mesa 04</h4>
                    <p className="text-xs text-muted">Salão Principal • IP Validado</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-rose-700 font-mono font-black text-xl">
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>00:{seconds < 10 ? `0${seconds}` : seconds}s</span>
                  </div>
                  <span className="text-xs text-muted">tempo de espera</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted">
              O chamado aparece instantaneamente no Modo TV da cozinha e no smartphone de todos os garçons com som de alerta.
            </p>

            <button
              onClick={() => setStep(3)}
              className="bg-emerald-100 hover:bg-emerald-200 text-ink font-bold px-6 py-3 rounded-xl shadow-card shadow-emerald-500/30 flex items-center gap-2 text-sm mx-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Garçom assume a mesa (PIN 1234)</span>
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 text-sm font-semibold mb-2">
                <span>Atendido em {seconds} segundos por Lucas Garçom</span>
              </div>
              <h4 className="text-xl font-black text-ink">Cliente Notificado na Mesa</h4>
              <div className="p-4 bg-white border border-outline rounded-xl mt-3 text-left shadow-sm">
                <p className="text-sm font-bold text-muted">📱 Notificação no Celular do Cliente:</p>
                <p className="text-sm text-blue-700 font-medium mt-1">
                  "Garçom Lucas a caminho da Mesa 04!"
                </p>
              </div>
            </div>

            <p className="text-sm text-muted">
              O chamado sai da fila dos outros garçons, evitando duplicidade e atendimento duplo.
            </p>

            <button
              onClick={() => setStep(4)}
              className="bg-action hover:bg-action-hover text-ink font-bold px-6 py-3 rounded-xl shadow-card text-sm mx-auto flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Cliente Pede a Conta via Pix</span>
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
              <h4 className="text-2xl font-black text-ink">Mesa Liberada em Tempo Recorde!</h4>
              <p className="text-sm text-muted mt-2">
                O cliente solicitou a conta especificando pagamento por Pix. O garçom já levou a maquininha/QR Code correto e a mesa girou 15 minutos mais rápido.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-peach rounded-xl border border-outline text-left">
              <div>
                <span className="text-sm text-muted">TMR (Tempo Médio):</span>
                <p className="text-base font-bold text-emerald-700">12 segundos</p>
              </div>
              <div>
                <span className="text-sm text-muted">Satisfação:</span>
                <p className="text-base font-bold text-yellow-400">⭐⭐⭐⭐⭐ 5.0</p>
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
