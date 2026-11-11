'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { LANDING_ICONS } from '@/lib/landing-assets';
import {
  PARALLAX_SCENERY_CONFIG,
  calculateScrollOffset,
  calculateMouseOffset,
  buildParallaxTransform
} from '@/lib/parallax';

export default function LandingBackgroundScenery() {
  const [scrollY, setScrollY] = useState(0);
  const [mouseRatio, setMouseRatio] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // 1. Detectar preferência por redução de movimento (Acessibilidade)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // 2. Listener de scroll com requestAnimationFrame (Passivo & Alta Performance)
    const handleScroll = () => {
      if (mediaQuery.matches) return;
      if (rafId.current) return;

      rafId.current = window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        setScrollY(currentScroll);
        rafId.current = null;
      });
    };

    // 3. Listener de mouse para profundidade 3D suave no desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (mediaQuery.matches || window.innerWidth < 768) return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const ratioX = (e.clientX - centerX) / centerX;
      const ratioY = (e.clientY - centerY) / centerY;

      setMouseRatio({
        x: Math.max(-1, Math.min(1, ratioX)),
        y: Math.max(-1, Math.min(1, ratioY)),
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Posição inicial de scroll
    setScrollY(window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  /**
   * Helper para construir o estilo inline de transformação de parallax.
   * Aplica translate3d acelerado por GPU e preserva a rotação despojada.
   */
  const getParallaxStyle = (id: keyof typeof PARALLAX_SCENERY_CONFIG) => {
    const config = PARALLAX_SCENERY_CONFIG[id];
    if (!config) return {};

    const scrollOffset = calculateScrollOffset(
      scrollY,
      config.speed,
      config.maxScrollOffset,
      reducedMotion
    );

    const mouseOffset = calculateMouseOffset(
      mouseRatio.x,
      mouseRatio.y,
      config.mouseFactor,
      config.maxMouseOffset,
      reducedMotion
    );

    // Constrói transform combinando translate3d(x, y, 0) e rotate(graus) para stickers despojados
    const transform = buildParallaxTransform(scrollOffset, mouseOffset, config.rotation);

    return {
      transform,
      WebkitTransform: transform,
      willChange: 'transform',
      transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)',
    };
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* ======================================================== */}
      {/* 1. HERO CANVAS: STICKERS DESPOJADOS COM PARALLAX NO TOPO */}
      {/* ======================================================== */}

      {/* Copo Cítrico (Canto Superior Esquerdo - Drink de Bar Despojado) */}
      <div
        className="hidden md:block absolute top-8 left-4 lg:left-10 xl:left-20"
        style={getParallaxStyle('drink')}
      >
        <div className="animate-float-slow">
          <div className="w-24 lg:w-32 h-24 lg:h-32 relative filter drop-shadow-2xl opacity-95 transition-transform hover:scale-110">
            <Image
              src={LANDING_ICONS.drink.src}
              alt=""
              width={128}
              height={128}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Hambúrguer Artesanal (Canto Superior Direito - Gastronomia Descontraída) */}
      <div
        className="hidden md:block absolute top-6 right-4 lg:right-10 xl:right-24"
        style={getParallaxStyle('burger')}
      >
        <div className="animate-float-slow-delayed">
          <div className="w-24 lg:w-36 h-24 lg:h-36 relative filter drop-shadow-2xl opacity-95 transition-transform hover:scale-110">
            <Image
              src={LANDING_ICONS.burger.src}
              alt=""
              width={144}
              height={144}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Campainha de Salão (Lateral Esquerda do Título Principal) */}
      <div
        className="hidden lg:block absolute top-72 left-2 xl:left-12"
        style={getParallaxStyle('bell')}
      >
        <div className="animate-float-slow-reverse">
          <div className="w-20 lg:w-28 h-20 lg:h-28 relative filter drop-shadow-xl opacity-90 transition-transform hover:scale-110">
            <Image
              src={LANDING_ICONS.bell.src}
              alt=""
              width={112}
              height={112}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Fatia de Pizza (Lateral Direita da Demonstração) */}
      <div
        className="hidden lg:block absolute top-80 right-2 xl:right-12"
        style={getParallaxStyle('pizza')}
      >
        <div className="animate-float-slow">
          <div className="w-20 lg:w-28 h-20 lg:h-28 relative filter drop-shadow-xl opacity-90 transition-transform hover:scale-110">
            <Image
              src={LANDING_ICONS.pizza.src}
              alt=""
              width={112}
              height={112}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TRANSIÇÃO CENTRAL: SMARTPHONE & MENU ABERTO          */}
      {/* ======================================================== */}

      {/* Smartphone com Massa (Margem Inferior do Hero à Esquerda) */}
      <div
        className="hidden xl:block absolute top-[920px] left-6 xl:left-16 opacity-85"
        style={getParallaxStyle('smartphone')}
      >
        <div className="animate-float-slow-delayed">
          <div className="w-24 lg:w-32 h-24 lg:h-32 relative filter drop-shadow-xl">
            <Image
              src={LANDING_ICONS.smartphone.src}
              alt=""
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Menu Aberto (Margem Inferior do Hero à Direita) */}
      <div
        className="hidden xl:block absolute top-[940px] right-6 xl:right-16 opacity-85"
        style={getParallaxStyle('menu')}
      >
        <div className="animate-float-slow">
          <div className="w-24 lg:w-32 h-24 lg:h-32 relative filter drop-shadow-xl">
            <Image
              src={LANDING_ICONS.menu.src}
              alt=""
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MEIO DA PÁGINA: PRATO & TALHERES + TOQUE DE CHEF     */}
      {/* ======================================================== */}

      {/* Toque de Chef (Flutuante na Margem do Comparativo) */}
      <div
        className="hidden lg:block absolute top-[1650px] left-4 xl:left-14 opacity-80"
        style={getParallaxStyle('chef')}
      >
        <div className="animate-float-slow-reverse">
          <div className="w-20 lg:w-28 h-20 lg:h-28 relative filter drop-shadow-lg">
            <Image
              src={LANDING_ICONS.chef.src}
              alt=""
              width={112}
              height={112}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Prato e Talheres (Flutuante na Margem Oposta) */}
      <div
        className="hidden lg:block absolute top-[1720px] right-4 xl:right-14 opacity-80"
        style={getParallaxStyle('dishPlate')}
      >
        <div className="animate-float-slow-delayed">
          <div className="w-20 lg:w-28 h-20 lg:h-28 relative filter drop-shadow-lg">
            <Image
              src={LANDING_ICONS.dishPlate.src}
              alt=""
              width={112}
              height={112}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
