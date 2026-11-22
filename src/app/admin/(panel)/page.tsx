'use client';
import { useEffect, useState } from 'react';
type Overview={restaurants:number;affiliates:number;tickets:number;commissionsCents:number;payoutsCents:number};
const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value/100);
export default function AdminOverview(){
 const [data,setData]=useState<Overview|null>(null),[error,setError]=useState('');
 useEffect(()=>{fetch('/api/platform-admin/overview',{cache:'no-store'}).then(async response=>{if(!response.ok)throw Error();setData(await response.json())}).catch(()=>setError('Não foi possível carregar os indicadores.'))},[]);
 return <section className="space-y-5"><div><h1 className="text-3xl font-black">Visão geral</h1><p className="text-muted">Acompanhe a operação da plataforma.</p></div>{error&&<p role="alert" className="text-red-700">{error}</p>}{!data&&!error&&<p>Carregando indicadores…</p>}{data&&<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[['Restaurantes',String(data.restaurants)],['Afiliados',String(data.affiliates)],['Chamados e contatos',String(data.tickets)],['Comissões registradas',money(data.commissionsCents)],['Repasses pagos',money(data.payoutsCents)]].map(([label,value])=><article key={label} className="rounded-2xl border border-outline bg-white p-5"><h2 className="text-sm font-bold text-muted">{label}</h2><p className="mt-2 text-3xl font-black">{value}</p></article>)}</div>}</section>;
}
