import { describe, it, expect } from 'vitest';
import {
  calculateScrollOffset,
  calculateMouseOffset,
  buildParallaxTransform,
  PARALLAX_SCENERY_CONFIG
} from '@/lib/parallax';
import fs from 'fs';
import path from 'path';

describe('TDD (RED -> GREEN): Parallax Cênico & Despojado da Landing Page', () => {
  describe('Cálculos Matemáticos de Scroll Parallax', () => {
    it('deve calcular deslocamento vertical positivo proporcional ao scroll', () => {
      // scroll 200px com speed 0.20 = 40px
      const offset = calculateScrollOffset(200, 0.20);
      expect(offset).toBeCloseTo(40, 1);
    });

    it('deve calcular deslocamento vertical negativo (contra-flutuação para profundidade 3D)', () => {
      // scroll 200px com speed -0.15 = -30px
      const offset = calculateScrollOffset(200, -0.15);
      expect(offset).toBeCloseTo(-30, 1);
    });

    it('deve limitar (clamp) o deslocamento dentro de margens seguras (maxOffset)', () => {
      // scroll 3000px com speed 0.50 e maxOffset 150 = não deve passar de 150
      const offset = calculateScrollOffset(3000, 0.50, 150);
      expect(offset).toBe(150);

      // scroll 3000px com speed -0.50 e maxOffset 150 = não deve ser menor que -150
      const offsetNeg = calculateScrollOffset(3000, -0.50, 150);
      expect(offsetNeg).toBe(-150);
    });

    it('deve retornar 0 quando o usuário tiver prefers-reduced-motion ativado', () => {
      const offset = calculateScrollOffset(500, 0.25, 200, true);
      expect(offset).toBe(0);
    });
  });

  describe('Cálculos de Mouse Depth Parallax (Desktop)', () => {
    it('deve calcular deslocamento em X e Y baseado na posição relativa ao centro [-1, 1]', () => {
      // mouse a meio caminho da direita (0.5) e topo (-0.5) com fator 20
      const mouse = calculateMouseOffset(0.5, -0.5, 20);
      expect(mouse.x).toBeCloseTo(10, 1);
      expect(mouse.y).toBeCloseTo(-10, 1);
    });

    it('deve respeitar maxOffset no movimento de mouse', () => {
      const mouse = calculateMouseOffset(1.0, 1.0, 100, 25);
      expect(mouse.x).toBe(25);
      expect(mouse.y).toBe(25);
    });

    it('deve retornar { x: 0, y: 0 } quando reducedMotion for verdadeiro', () => {
      const mouse = calculateMouseOffset(0.8, -0.8, 20, 30, true);
      expect(mouse.x).toBe(0);
      expect(mouse.y).toBe(0);
    });
  });

  describe('Construção de String de Transformação 3D', () => {
    it('deve gerar sintaxe translate3d preservando a rotação de cada elemento cênico', () => {
      const transform = buildParallaxTransform(30, { x: 5, y: -4 }, -14);
      // Deve conter translate3d com x (5px), y (30 - 4 = 26px), z (0px) e rotate(-14deg)
      expect(transform).toContain('translate3d(');
      expect(transform).toContain('rotate(-14deg)');
    });
  });

  describe('Configuração dos 8 Elementos Cênicos', () => {
    it('deve conter configurações específicas para todos os 8 elementos do cenário', () => {
      const expectedIds = ['drink', 'burger', 'bell', 'pizza', 'smartphone', 'menu', 'chef', 'dishPlate'];
      expect(Object.keys(PARALLAX_SCENERY_CONFIG)).toEqual(expect.arrayContaining(expectedIds));

      for (const id of expectedIds) {
        const item = PARALLAX_SCENERY_CONFIG[id as keyof typeof PARALLAX_SCENERY_CONFIG];
        expect(item).toBeDefined();
        expect(typeof item.speed).toBe('number');
        expect(typeof item.rotation).toBe('number');
        expect(typeof item.mouseFactor).toBe('number');
      }
    });

    it('deve ter velocidades intercaladas positivas e negativas para criar profundidade 3D', () => {
      const speeds = Object.values(PARALLAX_SCENERY_CONFIG).map((c: any) => c.speed);
      const hasPositive = speeds.some((s: number) => s > 0);
      const hasNegative = speeds.some((s: number) => s < 0);
      expect(hasPositive).toBe(true);
      expect(hasNegative).toBe(true);
    });
  });

  describe('Integração no Componente LandingBackgroundScenery', () => {
    it('o componente LandingBackgroundScenery deve importar e aplicar a mecânica de parallax', () => {
      const sceneryPath = path.join(
        process.cwd(),
        'src',
        'components',
        'public',
        'LandingBackgroundScenery.tsx'
      );
      const content = fs.readFileSync(sceneryPath, 'utf-8');
      expect(content).toContain('PARALLAX_SCENERY_CONFIG');
      expect(content).toContain('translate3d');
    });

    it('NÃO deve combinar a classe animate-float na mesma tag que possui style de parallax para evitar que keyframes CSS sobreponham o transform 3D', () => {
      const sceneryPath = path.join(
        process.cwd(),
        'src',
        'components',
        'public',
        'LandingBackgroundScenery.tsx'
      );
      const content = fs.readFileSync(sceneryPath, 'utf-8');

      const conflictPattern = /className="[^"]*animate-float[^"]*"\s*style=\{getParallaxStyle/g;
      const reverseConflictPattern = /style=\{getParallaxStyle[^}]*\}\s*className="[^"]*animate-float[^"]*"/g;

      expect(content).not.toMatch(conflictPattern);
      expect(content).not.toMatch(reverseConflictPattern);
    });
  });
});
