'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import CardapioBrandLogo from '@/components/public/CardapioBrandLogo';
import PublicThemeToggle from '@/components/public/PublicThemeToggle';

const links = [
  { href: '/#como-funciona', label: 'Como funciona' },
  { href: '/#sistema', label: 'O sistema' },
  { href: '/#planos', label: 'Planos' },
  { href: '/atendimento', label: 'Ajuda' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return <nav className="sticky top-0 z-50 border-b border-outline">
    <div className="max-w-[1120px] mx-auto px-5 sm:px-8 flex h-20 items-center justify-between gap-4">
      <Link href="/" aria-label="Cardap.io — início" className="flex items-center gap-2.5 text-ink"><CardapioBrandLogo size={48} priority /></Link>
      <div className="hidden lg:flex gap-6 items-center">{links.map(link => <Link key={link.href} href={link.href} className="text-sm font-medium text-ink hover:text-action">{link.label}</Link>)}<Link href="/recursos" className="text-sm font-medium text-ink hover:text-action">Recursos</Link><Link href="/parceiros" className="text-sm font-medium text-ink hover:text-action">Parceiros</Link></div>
      <div className="hidden lg:flex items-center gap-4"><PublicThemeToggle /><Link href="/login" className="text-sm font-bold text-ink">Entrar</Link><Link href="/cadastro" className="bg-action rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm font-bold">Criar cardápio <ArrowRight className="w-4 h-4" /></Link></div>
      <button type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="public-mobile-menu" onClick={() => setOpen(!open)} className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full border border-outline text-ink">{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
    </div>
    {open && <div id="public-mobile-menu" className="lg:hidden bg-cream border-t border-outline px-5 pb-5">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block py-3 text-ink font-medium">{link.label}</Link>)}<div className="flex items-center gap-3 pt-3"><PublicThemeToggle /><Link href="/login" className="flex-1 text-center rounded-full border border-outline py-3 font-bold">Entrar</Link><Link href="/cadastro" className="flex-1 text-center bg-action rounded-full py-3 font-bold">Criar cardápio</Link></div></div>}
  </nav>;
}
