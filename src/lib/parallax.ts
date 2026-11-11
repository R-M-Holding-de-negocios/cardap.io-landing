/**
 * Módulo de Parallax Cênico & Despojado - Anfc Cardapios
 * Suporte a deslocamento diferencial de scroll (eixo Y),
 * paralaxe suave de profundidade de mouse (desktop X/Y)
 * e conformidade com acessibilidade (prefers-reduced-motion).
 */

export interface ParallaxItemConfig {
  id: string;
  speed: number;        // Multiplicador de velocidade vertical no scroll (positivo ou negativo)
  mouseFactor: number;  // Multiplicador de influência do mouse em pixels
  rotation: number;     // Ângulo base de rotação em graus para estilo despojado
  maxScrollOffset?: number; // Limite máximo de deslocamento vertical
  maxMouseOffset?: number;  // Limite máximo de deslocamento pelo mouse
}

/**
 * Tabela de configurações dos 8 elementos cênicos do background
 */
export const PARALLAX_SCENERY_CONFIG: Record<string, ParallaxItemConfig> = {
  // 1. Hero Canvas
  drink: {
    id: 'drink',
    speed: 0.20,
    mouseFactor: -18,
    rotation: -14,
    maxScrollOffset: 220,
    maxMouseOffset: 25,
  },
  burger: {
    id: 'burger',
    speed: -0.16,
    mouseFactor: 22,
    rotation: 12,
    maxScrollOffset: 200,
    maxMouseOffset: 25,
  },
  bell: {
    id: 'bell',
    speed: 0.25,
    mouseFactor: -12,
    rotation: 8,
    maxScrollOffset: 240,
    maxMouseOffset: 20,
  },
  pizza: {
    id: 'pizza',
    speed: -0.20,
    mouseFactor: 16,
    rotation: -18,
    maxScrollOffset: 220,
    maxMouseOffset: 20,
  },

  // 2. Transição Central
  smartphone: {
    id: 'smartphone',
    speed: 0.18,
    mouseFactor: -15,
    rotation: -10,
    maxScrollOffset: 200,
    maxMouseOffset: 18,
  },
  menu: {
    id: 'menu',
    speed: -0.14,
    mouseFactor: 18,
    rotation: 14,
    maxScrollOffset: 180,
    maxMouseOffset: 18,
  },

  // 3. Meio da Página (Comparativo)
  chef: {
    id: 'chef',
    speed: 0.22,
    mouseFactor: -14,
    rotation: 10,
    maxScrollOffset: 200,
    maxMouseOffset: 16,
  },
  dishPlate: {
    id: 'dishPlate',
    speed: -0.18,
    mouseFactor: 16,
    rotation: -8,
    maxScrollOffset: 200,
    maxMouseOffset: 16,
  },
};

/**
 * Calcula o deslocamento vertical baseado na rolagem de tela e no fator de velocidade.
 * Se reducedMotion for true, retorna 0.
 */
export function calculateScrollOffset(
  scrollY: number,
  speed: number,
  maxOffset: number = 250,
  reducedMotion: boolean = false
): number {
  if (reducedMotion) return 0;
  const rawOffset = scrollY * speed;
  // Clamping seguro entre -maxOffset e +maxOffset
  return Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
}

/**
 * Calcula o deslocamento em X e Y causado pelo cursor do mouse em relação ao centro da tela.
 * mouseXRatio e mouseYRatio devem variar de -1 (esquerda/topo) a +1 (direita/base).
 * Se reducedMotion for true, retorna { x: 0, y: 0 }.
 */
export function calculateMouseOffset(
  mouseXRatio: number,
  mouseYRatio: number,
  factor: number,
  maxOffset: number = 30,
  reducedMotion: boolean = false
): { x: number; y: number } {
  if (reducedMotion) return { x: 0, y: 0 };
  const rawX = mouseXRatio * factor;
  const rawY = mouseYRatio * factor;
  return {
    x: Math.max(-maxOffset, Math.min(maxOffset, rawX)),
    y: Math.max(-maxOffset, Math.min(maxOffset, rawY)),
  };
}

/**
 * Constrói a string CSS transform aplicando aceleração por hardware 3D (translate3d)
 * combinando os offsets e preservando o ângulo de rotação do sticker.
 */
export function buildParallaxTransform(
  scrollOffset: number,
  mouseOffset: { x: number; y: number },
  baseRotation: number
): string {
  const finalX = Math.round((mouseOffset.x || 0) * 10) / 10;
  const finalY = Math.round(((scrollOffset || 0) + (mouseOffset.y || 0)) * 10) / 10;
  return `translate3d(${finalX}px, ${finalY}px, 0px) rotate(${baseRotation}deg)`;
}
