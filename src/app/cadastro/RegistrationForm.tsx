'use client';

import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { productUrl } from '@/lib/product-url';
import { registrationApiUrl } from '@/lib/registration-api';

const plans=[
  {id:'basic',name:'Básico',price:'R$ 59',description:'Cardápio digital e pedidos das mesas.'},
  {id:'essential',name:'Essencial',price:'R$ 79',description:'Cardápio, atendimento e relatórios.'},
  {id:'pro',name:'Pro',price:'R$ 149',description:'Atendimento e gestão do restaurante.'},
] as const;
export type SignupPlan=(typeof plans)[number]['id'];
type PaymentMethod='PIX'|'BOLETO'|'CREDIT_CARD';

export default function RegistrationForm(){
  const search=useSearchParams();
  const requestedPlan=search.get('plan');
  const initialPlan:SignupPlan=requestedPlan==='basic'||requestedPlan==='pro'?requestedPlan:'essential';
  const requestedRef=search.get('ref')?.trim().toUpperCase()||'';
  const initialRef=/^[A-Z0-9]{12}$/.test(requestedRef)?requestedRef:'';
  const apiUrl=registrationApiUrl();
  const [planId,setPlanId]=useState<SignupPlan>(initialPlan);
  const [paymentMethod,setPaymentMethod]=useState<PaymentMethod>('PIX');
  const [ref,setRef]=useState(initialRef);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [complete,setComplete]=useState(false);

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setLoading(true);setError('');
    const form=new FormData(event.currentTarget);
    const payload={
      restaurantName:String(form.get('restaurantName')||''),
      ownerName:String(form.get('ownerName')||''),
      email:String(form.get('email')||''),
      phone:String(form.get('phone')||''),
      password:String(form.get('password')||''),
      planId,paymentMethod,...(ref.trim()?{ref:ref.trim().toUpperCase()}:{})
    };
    try{
      const response=await fetch(apiUrl,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),credentials:'omit'});
      const result=await response.json() as {success?:boolean;error?:string};
      if(!response.ok||result.success!==true)throw new Error(result.error||'Não foi possível criar sua conta.');
      setComplete(true);
    }catch(cause){setError(cause instanceof Error?cause.message:'Falha de conexão. Tente novamente.');}
    finally{setLoading(false);}
  }

  return <main className="min-h-screen bg-cream px-5 py-10 text-ink sm:py-16">
    <section className="mx-auto max-w-3xl rounded-3xl border border-outline bg-white p-6 shadow-card sm:p-10">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-peach text-action"><Sparkles className="h-6 w-6"/></div>
      <p className="text-sm font-bold uppercase tracking-wider text-action">cardap.io</p>
      {complete?<div className="space-y-5" role="status">
        <CheckCircle2 className="h-10 w-10 text-action" aria-hidden="true"/>
        <h1 className="text-3xl font-black">Conta criada</h1>
        <p className="leading-relaxed text-muted">Entre com o e-mail e a senha que você acabou de cadastrar para acompanhar o pagamento. Seu cardápio será liberado após a confirmação da cobrança.</p>
        <a href={productUrl('/login')} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-action px-6 py-3 font-bold text-white">Entrar para acompanhar o pagamento <ArrowRight className="h-4 w-4"/></a>
      </div>:<>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Crie sua conta</h1>
        <p className="mt-3 leading-relaxed text-muted">Escolha seu plano e a forma de pagamento. Você entrará no sistema para acompanhar a cobrança após criar a conta.</p>
        {error&&<p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="mt-8 space-y-6">
          <fieldset><legend className="mb-3 font-bold">Escolha seu plano</legend><div className="grid gap-3 sm:grid-cols-3">{plans.map(plan=><label key={plan.id} className={`cursor-pointer rounded-2xl border p-4 ${planId===plan.id?'border-action bg-peach ring-2 ring-action':'border-outline'}`}>
            <input type="radio" name="plan" value={plan.id} checked={planId===plan.id} onChange={()=>setPlanId(plan.id)} className="sr-only"/>
            <span className="block font-bold">{plan.name}</span><span className="mt-1 block text-xl font-black">{plan.price}<small className="text-xs font-medium">/mês</small></span><span className="mt-2 block text-xs text-muted">{plan.description}</span>
          </label>)}</div></fieldset>
          <label className="block text-sm font-bold">Forma de pagamento<select value={paymentMethod} onChange={event=>setPaymentMethod(event.target.value as PaymentMethod)} className="mt-1 min-h-12 w-full rounded-xl border border-outline bg-white p-3"><option value="PIX">Pix</option><option value="BOLETO">Boleto</option><option value="CREDIT_CARD">Cartão de crédito</option></select></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold">Estabelecimento<input name="restaurantName" required maxLength={120} className="mt-1 min-h-12 w-full rounded-xl border border-outline p-3" placeholder="Nome do restaurante"/></label>
            <label className="block text-sm font-bold">Seu nome<input name="ownerName" required maxLength={120} className="mt-1 min-h-12 w-full rounded-xl border border-outline p-3" placeholder="Nome completo"/></label>
            <label className="block text-sm font-bold">E-mail<input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-1 min-h-12 w-full rounded-xl border border-outline p-3" placeholder="voce@restaurante.com"/></label>
            <label className="block text-sm font-bold">WhatsApp<input name="phone" type="tel" autoComplete="tel" required className="mt-1 min-h-12 w-full rounded-xl border border-outline p-3" placeholder="(11) 99999-9999"/></label>
          </div>
          <label className="block text-sm font-bold">Senha de acesso<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={72} className="mt-1 min-h-12 w-full rounded-xl border border-outline p-3"/><span className="mt-1 block text-xs font-normal text-muted">Use ao menos 12 caracteres.</span></label>
          <label className="block text-sm font-bold">Código de afiliado<input value={ref} onChange={event=>setRef(event.target.value.toUpperCase())} maxLength={12} autoComplete="off" className="mt-1 min-h-12 w-full rounded-xl border border-outline p-3" placeholder="Opcional"/><span className="mt-1 block text-xs font-normal text-muted">Identifica quem indicou seu restaurante; não altera o preço.</span></label>
          <button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-action px-6 py-3 font-bold text-white disabled:opacity-60">{loading?'Criando conta...':'Criar conta e continuar'}<ArrowRight className="h-4 w-4"/></button>
        </form>
      </>}
    </section>
  </main>;
}
