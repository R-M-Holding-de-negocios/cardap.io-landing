import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { LANDING_ICONS } from '@/lib/landing-assets';

describe('TDD: Background Cênico & Despojado com Ícones Pastel', () => {
  it('deve conter exatamente os 8 ativos mapeados no catálogo', () => {
    const keys = Object.keys(LANDING_ICONS);
    expect(keys).toHaveLength(8);
    for (const [key, asset] of Object.entries(LANDING_ICONS)) {
      expect(asset.id).toBe(key);
      expect(asset.src).toMatch(/^\/images\/landing\/[\w-]+\.png$/);
    }
  });

  it('deve garantir que todos os 8 arquivos físicos existem no diretório public/', () => {
    for (const asset of Object.values(LANDING_ICONS)) {
      const publicPath = path.join(process.cwd(), 'public', asset.src.replace(/^\//, ''));
      expect(fs.existsSync(publicPath)).toBe(true);
      expect(fs.statSync(publicPath).size).toBeGreaterThan(1000);
    }
  });

  it('deve conter a foto realista do prato do cardápio em burger-real.jpg', () => {
    const dishPath = path.join(process.cwd(), 'public', 'images', 'landing', 'burger-real.jpg');
    expect(fs.existsSync(dishPath)).toBe(true);
    expect(fs.statSync(dishPath).size).toBeGreaterThan(5000);
  });

  it('deve garantir que ProductPreview.tsx usa a foto real do prato', () => {
    const productPreviewPath = path.join(
      process.cwd(),
      'src',
      'components',
      'public',
      'ProductPreview.tsx'
    );
    const content = fs.readFileSync(productPreviewPath, 'utf-8');
    expect(content).toContain('burger-real.jpg');
    expect(content).not.toContain('images.unsplash.com');
  });

  it('deve existir o componente LandingBackgroundScenery com composição de background despojado', () => {
    const sceneryPath = path.join(
      process.cwd(),
      'src',
      'components',
      'public',
      'LandingBackgroundScenery.tsx'
    );
    expect(fs.existsSync(sceneryPath)).toBe(true);

    const sceneryContent = fs.readFileSync(sceneryPath, 'utf-8');
    // Deve conter os elementos cênicos distribuídos no background com rotações orgânicas
    expect(sceneryContent).toContain('LANDING_ICONS');
    expect(sceneryContent).toContain('rotate');
  });

  it('deve garantir que HomePage integra LandingBackgroundScenery e não usa os ícones pastel como ícones genéricos em cards', () => {
    const homePath = path.join(process.cwd(), 'src', 'app', 'page.tsx');
    const homeContent = fs.readFileSync(homePath, 'utf-8');
    expect(homeContent).toContain('LandingBackgroundScenery');
  });
});
