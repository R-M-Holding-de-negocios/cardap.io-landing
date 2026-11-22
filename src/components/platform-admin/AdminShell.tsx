'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';

const links=[['/admin','Visão geral'],['/admin/restaurants','Restaurantes'],['/admin/affiliates','Afiliados'],['/admin/payouts','Repasses'],['/admin/support','Atendimento'],['/admin/audit','Auditoria']];
export default function AdminShell({email,children}:{email:string;children:ReactNode}){
 async function logout(){await fetch('/api/platform-admin/logout',{method:'POST'});window.location.assign('/admin/login');}
 return <div className="presentation-theme utility-theme min-h-screen bg-cream text-ink">
  <header className="border-b border-outline bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4"><Link href="/admin" className="text-xl font-black text-action">cardap.io <span className="text-sm font-bold text-muted">Administração</span></Link><div className="flex items-center gap-3 text-sm"><span className="max-w-48 truncate text-muted">{email}</span><button type="button" onClick={logout} className="min-h-11 rounded-full border border-outline px-4 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">Sair</button></div></div></header>
  <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[210px_minmax(0,1fr)]"><nav aria-label="Administração" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col">{links.map(([href,label])=><Link key={href} href={href} className="flex min-h-11 shrink-0 items-center rounded-xl border border-outline bg-white px-4 text-sm font-bold text-muted hover:border-action focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">{label}</Link>)}</nav><main className="min-w-0">{children}</main></div>
 </div>;
}
