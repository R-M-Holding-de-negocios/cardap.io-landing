'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PartnerResetForm from '@/components/partner/PartnerResetForm';
export default function PartnerResetPage(){
 const [token,setToken]=useState('');
 useEffect(()=>{const value=new URLSearchParams(window.location.search).get('token')||'';if(/^[a-f0-9]{64}$/.test(value))setToken(value);window.history.replaceState(null,'','/partner/reset')},[]);
 return <div className="presentation-theme utility-theme grid min-h-screen place-items-center bg-cream p-5"><main className="w-full max-w-md space-y-5 rounded-3xl border border-outline bg-white p-7"><h1 className="text-3xl font-black">Recuperar acesso de afiliado</h1><p className="text-sm text-muted">Use o link de uso único enviado após a verificação de identidade.</p><PartnerResetForm token={token}/><Link href="/partner/login" className="font-bold text-action underline">Voltar ao portal do afiliado</Link></main></div>;
}
