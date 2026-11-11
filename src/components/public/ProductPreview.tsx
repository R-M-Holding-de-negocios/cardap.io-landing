import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Check, Clock, QrCode } from 'lucide-react';
import { LANDING_ICONS } from '@/lib/landing-assets';
import { productUrl } from '@/lib/product-url';

export default function ProductPreview() {
  return (
    <div className="product-preview relative mx-auto mt-12 max-w-4xl">
      {/* Decorative ambient scenery stickers attached to preview framing */}
      <div
        className="hidden lg:block absolute -top-8 -left-10 z-20 pointer-events-none select-none animate-float-slow"
        style={{ '--scenery-rot': '-8deg' } as React.CSSProperties}
        aria-hidden="true"
      >
        <div className="w-20 h-20 relative drop-shadow-md">
          <Image
            src={LANDING_ICONS.bell.src}
            alt=""
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
      </div>

      <div
        className="hidden lg:block absolute -bottom-8 -right-8 z-20 pointer-events-none select-none animate-float-slow-delayed"
        style={{ '--scenery-rot': '10deg' } as React.CSSProperties}
        aria-hidden="true"
      >
        <div className="w-24 h-24 relative drop-shadow-md">
          <Image
            src={LANDING_ICONS.drink.src}
            alt=""
            width={96}
            height={96}
            className="object-contain"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-outline bg-peach p-5 sm:p-8 shadow-card relative z-10">
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
          <span className="text-sm text-muted font-medium">Exemplo de uso em tempo real</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card Esquerdo: Cardápio Real do Cliente na Mesa */}
          <Link
            href={productUrl('/m/v1-anfc-mesa01-x8k9a')}
            className="rounded-2xl border border-outline bg-white p-4 sm:p-5 block group transition-transform hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-bold text-ink">Anfc Bistro & Lounge</p>
                <p className="text-sm text-muted">Cardápio da mesa 01</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-action" />
              </div>
            </div>

            {/* Foto real e apetitosa do prato do cardápio do restaurante */}
            <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-slate-900 border border-outline/30 flex items-center justify-center">
              <Image
                src="/images/landing/burger-real.jpg"
                alt="Hambúrguer artesanal do cardápio Anfc"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                priority
                className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex items-start justify-between gap-3 mt-4">
              <div>
                <p className="font-bold text-ink text-base">Anfc Monster Bacon Smash</p>
                <p className="text-sm text-muted">Burgers artesanais com fotos em HD</p>
              </div>
              <span className="font-black text-ink whitespace-nowrap text-base">R$ 46,90</span>
            </div>

            <span className="mt-4 flex items-center justify-between border-t border-outline pt-3 font-bold text-action text-sm group-hover:text-amber-800">
              Explorar o cardápio interativo
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
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Salão Ativo
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
                    <span className="text-xs text-muted">Chamou garçom · Salão principal</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-action font-black bg-white px-2.5 py-1.5 rounded-lg border border-outline/50 shadow-sm">
                  <Clock className="w-3.5 h-3.5" /> 00:04s
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-outline bg-cream p-3 text-xs sm:text-sm text-ink leading-relaxed">
                A equipe visualiza a fila em ordem cronológica de chamada com cronômetro em tempo real.
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
                    Tudo flui em um só toque.
                  </h3>
                </div>
                <p className="text-muted text-xs sm:text-sm leading-relaxed">
                  Seu cliente vê os pratos com fotos e reels, chama o garçom e pede a conta pelo celular. Sua equipe atende sem correria pelo painel e modo TV.
                </p>
              </div>

              <div className="pt-3 border-t border-outline/50 mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero atritos. Rastreabilidade total por PIN.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
