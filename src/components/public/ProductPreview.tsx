import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Check, QrCode } from 'lucide-react';
import { LANDING_ICONS } from '@/lib/landing-assets';
import { productUrl } from '@/lib/product-url';

export default function ProductPreview() {
  return (
    <div className="product-preview relative mx-auto mt-12 max-w-4xl">
      <div className="rounded-3xl border border-outline bg-peach p-5 sm:p-8 shadow-card relative">
        {/* Header da Preview */}
        <div className="flex items-center justify-between mb-5 text-ink">
          <span className="flex items-center gap-2.5 text-sm font-bold">
            <div className="w-7 h-7 relative rounded-lg bg-white/90 p-0.5 border border-outline/30 flex items-center justify-center overflow-hidden">
              <Image
                src={LANDING_ICONS.dishPlate.src}
                alt=""
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <span>Da mesa ao salão</span>
          </span>
          <span className="text-sm text-muted font-medium">Cardápio e atendimento</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card Esquerdo: Cardápio Real do Cliente na Mesa */}
          <Link
            href={productUrl('/recursos')}
            className="rounded-2xl border border-outline bg-white p-4 sm:p-5 block group transition-transform hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-bold text-ink">Cardápio do restaurante</p>
                <p className="text-sm text-muted">Cardápio da mesa</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-action" />
              </div>
            </div>

            {/* Foto real e apetitosa do prato do cardápio do restaurante */}
            <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-slate-900 border border-outline/30 flex items-center justify-center">
              <Image
                src="/images/landing/burger-real.jpg"
                alt="Produto disponível no cardápio digital"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                priority
                className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex items-start justify-between gap-3 mt-4">
              <div>
              <p className="font-bold text-ink text-base">Produto do cardápio</p>
                <p className="text-sm text-muted">Foto e informações para ajudar na escolha</p>
              </div>
              <span className="font-black text-ink whitespace-nowrap text-base">No cardápio</span>
            </div>

            <span className="mt-4 flex items-center justify-between border-t border-outline pt-3 font-bold text-action text-sm group-hover:text-amber-800">
              Conheça recursos e planos
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>

          {/* Coluna Direita: Painel de Atendimento e Benefícios */}
          <div className="flex flex-col gap-4">
            {/* Card Fila de Atendimento */}
            <div className="rounded-2xl border border-outline bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-black text-muted uppercase tracking-wider">
                  Painel de Atendimento ao Vivo
                </p>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 text-action text-xs font-bold border border-orange-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-action" />
                  Atendimento
                </span>
              </div>

              <div className="flex justify-between items-center bg-peach/40 p-3 rounded-xl border border-outline/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 relative shrink-0">
                    <Image
                      src={LANDING_ICONS.bell.src}
                      alt={LANDING_ICONS.bell.alt}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">Mesa 01</span>
                    <span className="text-xs text-muted">Solicitação da mesa</span>
                  </div>
                </div>
                <span className="text-xs text-action font-black bg-white px-2.5 py-1.5 rounded-lg border border-outline/50 shadow-sm">Na fila</span>
              </div>

              <div className="mt-4 rounded-xl border border-outline bg-cream p-3 text-xs sm:text-sm text-ink leading-relaxed">
                A equipe acompanha pedidos e chamadas em uma fila de atendimento.
              </div>
            </div>

            {/* Card Experiência Unificada */}
            <div className="rounded-2xl border border-outline bg-white p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 relative shrink-0">
                    <Image
                      src={LANDING_ICONS.menu.src}
                      alt={LANDING_ICONS.menu.alt}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-black text-base text-ink">
                    Cardápio, pedidos e atendimento conectados.
                  </h3>
                </div>
                <p className="text-muted text-xs sm:text-sm leading-relaxed">
                  O cliente consulta o menu pelo celular e envia pedidos, chamadas e solicitações de conta para a equipe acompanhar.
                </p>
              </div>

              <div className="pt-3 border-t border-outline/50 mt-3 flex items-center gap-2 text-xs font-semibold text-muted">
                <Check className="w-4 h-4 text-action shrink-0" />
                <span>Acompanhamento das solicitações pelo painel.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
