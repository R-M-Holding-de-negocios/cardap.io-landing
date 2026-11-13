import Link from 'next/link';
import CardapioBrandLogo from '@/components/public/CardapioBrandLogo';

export default function Footer({ compact = false, supportHref = '/dashboard/account?section=support' }: { compact?: boolean; supportHref?: string }) {
  if (compact) return <footer className="cardapio-compact-footer border-t border-outline bg-peach px-5 py-4 sm:px-8">
    <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4">
      <Link href="/" aria-label="Cardap.io — página inicial"><CardapioBrandLogo size={34} /></Link>
      <span className="text-xs text-muted">© {new Date().getFullYear()} Cardap.io</span>
      <Link href={supportHref} className="text-sm font-bold text-action">Ajuda e suporte</Link>
    </div>
  </footer>;

  return <footer className="public-flow-footer border-t border-outline bg-peach py-10 sm:py-12">
    <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <div className="space-y-3"><Link href="/" aria-label="Cardap.io — página inicial"><CardapioBrandLogo size={42} /></Link><p className="max-w-md text-sm text-muted">Cardápios digitais e ferramentas para organizar o atendimento do restaurante.</p></div>
      <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
        <Link href="/#sistema" className="text-muted hover:text-action">O sistema</Link>
        <Link href="/#planos" className="text-muted hover:text-action">Planos</Link>
        <Link href="/atendimento" className="text-muted hover:text-action">Ajuda</Link>
        <Link href="/login" className="text-muted hover:text-action">Entrar</Link>
      </nav>
    </div>
    <div className="mx-auto mt-8 max-w-[1120px] border-t border-outline px-5 pt-5 text-xs text-muted sm:px-6 lg:px-8">© {new Date().getFullYear()} Cardap.io</div>
  </footer>;
}
