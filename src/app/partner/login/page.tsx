'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import PartnerFinancialSummary from '@/components/partner/PartnerFinancialSummary';
import PartnerPasswordChange from '@/components/partner/PartnerPasswordChange';
import PartnerTrafficSummary from '@/components/partner/PartnerTrafficSummary';
import PartnerPromotion from '@/components/partner/PartnerPromotion';
import type { SignupPromotion } from '@/lib/signup-promotion';
import AffiliateLedger from '@/components/partner/AffiliateLedger';
import PayoutEligibilityNotice from '@/components/partner/PayoutEligibilityNotice';

type Restaurant={name:string;status:string;referredAt:string;earningsCents:number};
type Dashboard={code:string;restaurantCount:number;linkVisits:number;trialCount:number;activeSubscriptionCount:number;earningsCents:number;balanceCents:number;availableCents:number;paidCents:number;qualifiedRestaurantCount:number;minimumRestaurantCount:number;restaurants:Restaurant[];promotion?:SignupPromotion|null};
const money=(cents:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);

export default function PartnerPortalPage(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[dashboard,setDashboard]=useState<Dashboard|null>(null),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const load=useCallback(async()=>{try{const response=await fetch('/api/affiliates/dashboard',{cache:'no-store'});if(response.ok){setDashboard(await response.json())}else setDashboard(null)}catch{setDashboard(null)}finally{setLoading(false)}},[]);
 useEffect(()=>{void load()},[load]);
 async function login(event:React.FormEvent){event.preventDefault();setBusy(true);setError('');try{const response=await fetch('/api/affiliates/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})});if(!response.ok){const data=await response.json();setError(data.error||'Não foi possível entrar.');return}setPassword('');await load()}catch{setError('Erro de conexão. Tente novamente.')}finally{setBusy(false)}}
 async function logout(){await fetch('/api/affiliates/logout',{method:'POST'});setDashboard(null)}
 const link=dashboard&&typeof window!=='undefined'?`${window.location.origin}/r/${dashboard.code}`:'';
 return <div className="presentation-theme utility-theme min-h-screen bg-cream flex flex-col"><Navbar/><main className="flex-1 w-full max-w-5xl mx-auto px-5 sm:px-6 py-10 space-y-6">
  <h1 className="text-3xl font-black text-muted">Portal do afiliado</h1>
  {loading?<p className="text-muted">Carregando...</p>:dashboard?<>
   <div className="flex justify-end"><button onClick={logout} className="font-bold text-action underline">Sair</button></div>
   <section className="rounded-3xl bg-peach border border-outline p-6 space-y-3"><h2 className="font-black text-muted">Seu código de afiliado: {dashboard.code}</h2><p className="text-sm text-muted">Compartilhe o link para que o restaurante se cadastre com sua indicação.</p><div className="flex flex-wrap gap-3 items-center"><code className="break-all text-sm">{link}</code><button type="button" onClick={()=>navigator.clipboard.writeText(link)} className="rounded-xl bg-action px-4 py-2 font-bold">Copiar link</button></div></section>
   <PartnerPromotion promotion={dashboard.promotion??null}/>
   <section className="rounded-3xl bg-white border border-outline p-6"><h2 className="text-sm font-bold text-muted">Restaurantes indicados</h2><p className="text-3xl font-black">{dashboard.restaurantCount}</p></section>
   <PartnerFinancialSummary earningsCents={dashboard.earningsCents} balanceCents={dashboard.balanceCents} availableCents={dashboard.availableCents} paidCents={dashboard.paidCents}/>
   <PayoutEligibilityNotice qualifiedRestaurantCount={dashboard.qualifiedRestaurantCount} minimumRestaurantCount={dashboard.minimumRestaurantCount}/>
   <PartnerTrafficSummary linkVisits={dashboard.linkVisits} trialCount={dashboard.trialCount} activeSubscriptionCount={dashboard.activeSubscriptionCount}/>
   <AffiliateLedger/>
   <section className="rounded-3xl bg-white border border-outline p-6"><h2 className="font-black text-muted mb-4">Restaurantes</h2>{dashboard.restaurants.length===0?<p className="text-sm text-muted">Nenhum restaurante indicado ainda.</p>:<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Restaurante</th><th className="p-2">Cadastro</th><th className="p-2">Situação</th><th className="p-2">Comissões</th></tr></thead><tbody>{dashboard.restaurants.map((restaurant,index)=><tr key={`${restaurant.name}-${index}`}><td className="p-2">{restaurant.name}</td><td className="p-2">{new Date(restaurant.referredAt).toLocaleDateString('pt-BR')}</td><td className="p-2">{restaurant.status}</td><td className="p-2">{money(restaurant.earningsCents)}</td></tr>)}</tbody></table></div>}</section>
   <PartnerPasswordChange onChanged={()=>setDashboard(null)}/>
  </>:<section className="max-w-md rounded-3xl bg-white border border-outline p-6 space-y-4"><h2 className="text-xl font-black text-muted">Entrar como afiliado</h2><p className="text-sm text-muted">O acesso é liberado após a aprovação da candidatura.</p>{error&&<p role="alert" className="text-red-700">{error}</p>}<form onSubmit={login} className="space-y-4"><label className="block text-sm font-bold">E-mail<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-outline p-3"/></label><label className="block text-sm font-bold">Senha<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-outline p-3"/></label><button disabled={busy} className="w-full rounded-xl bg-action p-3 font-black">{busy?'Entrando...':'Entrar'}</button></form><Link href="/parceiros" className="text-action font-bold">Quero ser afiliado</Link></section>}
 </main><Footer/></div>;
}
