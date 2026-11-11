'use client';

import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  priority?: boolean;
  className?: string;
  textClassName?: string;
  subtitle?: string;
  variant?: 'image' | 'vector';
}

/**
 * BrandLogo — Identidade Visual Oficial do Anfc Cardapios
 * Lockup Oficial: Monograma 'A' com Ondas de Sinal NFC + Tipografia "Anfc Cardápios" integrada (1742 x 708, proporção ~2.46:1).
 * Não renderiza texto HTML duplicado ("Anfc Cardapios"), pois a própria logo já contém o nome oficial estilizado.
 */
export default function BrandLogo({
  size = 'md',
  showText = false,
  priority = false,
  className = '',
  textClassName = '',
  subtitle,
  variant = 'image',
}: BrandLogoProps) {
  // Escala generosa para leitura e destaque da marca
  let dimension = 50;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'sm':
        dimension = 38;
        break;
      case 'md':
        dimension = 50;
        break;
      case 'lg':
        dimension = 64;
        break;
      case 'xl':
        dimension = 80;
        break;
    }
  }

  // Proporção oficial de aspecto do lockup (1742px x 708px = ~2.46:1)
  const width = Math.round(dimension * 2.46);
  const height = dimension;

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div
        className="relative shrink-0 flex items-center justify-center overflow-hidden"
        style={{ width, height }}
      >
        <Image
          src="/logo-anfc-cardapios.png"
          alt="Anfc Cardápios — Escaneou. Chamou. Chegou."
          width={width}
          height={height}
          priority={priority}
          className="object-contain w-full h-full drop-shadow-sm select-none"
        />
      </div>

      {subtitle && (
        <span
          className={`text-[11px] font-black uppercase tracking-wider text-muted mt-1.5 ${textClassName}`}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
