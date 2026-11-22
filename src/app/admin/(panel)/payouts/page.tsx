'use client';
import { useCallback, useEffect, useState } from 'react';
import PayoutTable,{type PayoutRow} from '@/components/platform-admin/PayoutTable';
import PayoutDueTable,{type PayoutDueRow} from '@/components/platform-admin/PayoutDueTable';

type Target={id:string;action:'paid'|'cancel'};
export default function AdminPayouts(){
 const [items,setItems]=useState<PayoutRow[]>([]);
 const [dueItems,setDueItems]=useState<PayoutDueRow[]>([]);
 const [cursor,setCursor]=useState(''),[nextCursor,setNextCursor]=useState<string|null>(null);
 const [dueCursor,setDueCursor]=useState(''),[nextDueCursor,setNextDueCursor]=useState<string|null>(null);
 const [target,setTarget]=useState<Target|null>(null),[reference,setReference]=useState(''),[reason,setReason]=useState('');
 const [loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const load=useCallback(async()=>{
  setLoading(true);setError('');
  try{
   const params=new URLSearchParams({limit:'20',...(cursor?{cursor}:{})});
   const dueParams=new URLSearchParams({limit:'20',...(dueCursor?{cursor:dueCursor}:{})});
   const [response,dueResponse]=await Promise.all([fetch(`/api/platform-admin/payouts?${params}`,{cache:'no-store'}),fetch(`/api/platform-admin/payouts/due?${dueParams}`,{cache:'no-store'})]);
   if(!response.ok||!dueResponse.ok)throw Error();
   const data=await response.json() as {items:PayoutRow[];nextCursor:string|null};
   const dueData=await dueResponse.json() as {items:PayoutDueRow[];nextCursor:string|null};
   setItems(data.items);setNextCursor(data.nextCursor);
   setDueItems(dueData.items);setNextDueCursor(dueData.nextCursor);
  }catch{setError('Não foi possível carregar os repasses.')}finally{setLoading(false)}
 },[cursor,dueCursor]);
 useEffect(()=>{void load()},[load]);
 async function save(event:React.FormEvent){
  event.preventDefault();if(!target)return;
  setBusy(true);setError('');
  try{
   const response=await fetch(`/api/platform-admin/payouts/${encodeURIComponent(target.id)}/${target.action}`,{
    method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(target.action==='paid'?{reference,reason}:{reason}),
   });
   const data=await response.json();if(!response.ok)throw Error(data.error||'Registro não concluído.');
   setTarget(null);setReference('');setReason('');await load();
  }catch(e){setError(e instanceof Error?e.message:'Registro não concluído.')}finally{setBusy(false)}
 }
 const title=target?.action==='cancel'?'Cancelar reserva':'Registrar Pix realizado';
 return <section className="space-y-5">
  <div><h1 className="text-3xl font-black">Repasses</h1><p className="text-muted">Acompanhe valores aprovados e registre o Pix depois de executá-lo fora do site.</p></div>
  {error&&<p role="alert" className="text-red-700">{error}</p>}
  <div className="space-y-3"><h2 className="text-xl font-black">Valores liberados para conferência</h2><p className="text-sm text-muted">Confira a indicação e faça o Pix no prazo. A liberação ocorre após 7 dias; esta lista não envia dinheiro.</p>{loading?<p>Carregando valores liberados…</p>:<PayoutDueTable items={dueItems}/>}<div className="flex gap-3"><button type="button" disabled={!dueCursor} onClick={()=>setDueCursor('')} className="min-h-11 rounded-full border border-outline px-4 disabled:opacity-50">Início</button><button type="button" disabled={!nextDueCursor} onClick={()=>setDueCursor(nextDueCursor||'')} className="min-h-11 rounded-full border border-outline px-4 disabled:opacity-50">Próxima página</button></div></div>
  <h2 className="text-xl font-black">Repasses aprovados e pagos</h2>
  {loading?<p>Carregando repasses…</p>:<PayoutTable items={items} onSelect={id=>setTarget({id,action:'paid'})} onCancel={id=>setTarget({id,action:'cancel'})}/>}
  <div className="flex gap-3"><button type="button" disabled={!cursor} onClick={()=>setCursor('')} className="min-h-11 rounded-full border border-outline px-4 disabled:opacity-50">Início</button><button type="button" disabled={!nextCursor} onClick={()=>setCursor(nextCursor||'')} className="min-h-11 rounded-full border border-outline px-4 disabled:opacity-50">Próxima página</button></div>
  {target&&<div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"><form onSubmit={save} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 text-ink">
   <h2 className="text-xl font-black">{title}</h2>
   <p className="text-sm text-muted">{target.action==='paid'?'Confirme no banco que o Pix foi concluído. Este registro não envia dinheiro.':'Cancelar libera o valor reservado para nova análise. Um Pix já realizado não pode ser cancelado aqui.'}</p>
   {target.action==='paid'&&<label className="block text-sm font-bold">Referência do comprovante<input required maxLength={160} value={reference} onChange={e=>setReference(e.target.value)} className="mt-1 block min-h-11 w-full rounded-xl border border-outline p-3"/></label>}
   <label className="block text-sm font-bold">Motivo ou observação<textarea required minLength={3} maxLength={500} value={reason} onChange={e=>setReason(e.target.value)} className="mt-1 block w-full rounded-xl border border-outline p-3"/></label>
   <div className="flex justify-end gap-2"><button type="button" onClick={()=>setTarget(null)} className="min-h-11 rounded-full border border-outline px-4">Voltar</button><button disabled={busy} className="min-h-11 rounded-full bg-action px-4 font-bold text-white disabled:opacity-50">{target.action==='paid'?'Marcar como pago':'Cancelar reserva'}</button></div>
  </form></div>}
 </section>;
}
