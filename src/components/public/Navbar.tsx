'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BrandLogo from '@/components/public/BrandLogo';
import { LandingThemeToggle, useLandingTheme } from '@/components/public/LandingThemeProvider';
import { productUrl } from '@/lib/product-url';
import StaggeredMenu from '@/components/public/react-bits/StaggeredMenu';
const links = [{href: '/#como-funciona', label: 'Como funciona'}, {href: '/#sistema', label: 'O sistema'}, {href: '/#planos', label: 'Planos'}, {href: '/parceiros', label: 'Parceiros'}];
export default function Navbar() {
  const { theme } = useLandingTheme();
  return <nav className="sticky top-0 z-50 border-b border-outline">
    <div className="max-w-[1120px] mx-auto px-5 sm:px-8 flex h-20 items-center justify-between gap-4">
      <Link href="/" aria-label="cardap.io — início" className="hidden lg:flex items-center gap-2.5 text-ink">
        <BrandLogo size={48} priority={true} />
      </Link>
      <div className="hidden lg:flex gap-6 items-center">{links.map(link => <Link key={link.href} href={link.href.startsWith('/#') ? link.href : productUrl(link.href)} className="text-sm font-medium text-ink hover:text-action">{link.label}</Link>)}</div>
      <div className="hidden lg:flex items-center gap-5"><LandingThemeToggle /><Link href={productUrl('/login')} className="text-sm font-bold text-ink">Entrar</Link><Link href={productUrl('/cadastro')} className="bg-action rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm font-bold">Criar cardápio <ArrowRight className="w-4 h-4" /></Link></div>
      <span className="lg:hidden" aria-hidden="true" />
    </div>
    <div className="landing-mobile-menu lg:hidden">
      <StaggeredMenu
        isFixed
        position="right"
        colors={theme === 'dark' ? ['#f97316', '#30251d', '#121212'] : ['#F97316', '#FFE2CA', '#FFF8F0']}
        logoUrl={theme === 'dark' ? '/logo-cardapio-dark.png' : '/logo-cardapio-light.png'}
        menuButtonColor={theme === 'dark' ? '#f5f0eb' : '#25211e'}
        openMenuButtonColor={theme === 'dark' ? '#f5f0eb' : '#25211e'}
        accentColor="#F97316"
        displaySocials={false}
        displayItemNumbering={false}
        headerActions={<LandingThemeToggle compact />}
        items={[
          { label: 'Como funciona', link: '/#como-funciona' },
          { label: 'O sistema', link: '/#sistema' },
          { label: 'Planos', link: '/#planos' },
          { label: 'Parceiros', link: productUrl('/parceiros') },
          { label: 'Entrar', link: productUrl('/login') },
          { label: 'Criar cardápio', link: productUrl('/cadastro') },
        ]}
      />
    </div>
  </nav>;
}
