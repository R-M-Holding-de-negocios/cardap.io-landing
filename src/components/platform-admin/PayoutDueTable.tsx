import Link from 'next/link';

export type PayoutDueRow={affiliateId:string;email:string;availableCents:number;oldestDueAt:string;payByAt:string};
const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value/100);
const date=(value:string)=>new Date(value).toLocaleDateString('pt-BR',{timeZone:'America/Bahia'});
const localDay=(value:Date)=>value.toLocaleDateString('sv-SE',{timeZone:'America/Bahia'});

export default function PayoutDueTable({items}:{items:PayoutDueRow[]}){
 if(!items.length)return <p className="rounded-2xl border border-outline bg-white p-6 text-muted">Nenhum valor liberado aguardando aprovação.</p>;
 const today=localDay(new Date());
 return <div className="overflow-x-auto rounded-2xl border border-outline bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-peach"><tr><th className="p-4">Afiliado</th><th className="p-4">Valor liberado</th><th className="p-4">Data de liberação</th><th className="p-4">Data limite</th><th className="p-4">Situação</th><th className="p-4">Ação</th></tr></thead><tbody>{items.map(item=><tr key={item.affiliateId} className="border-t border-outline"><td className="p-4">{item.email}</td><td className="p-4 font-bold">{money(item.availableCents)}</td><td className="p-4">{date(item.oldestDueAt)}</td><td className="p-4">{date(item.payByAt)}</td><td className="p-4 font-bold">{localDay(new Date(item.payByAt))<today?'Prazo vencido':localDay(new Date(item.payByAt))===today?'Vence hoje':'No prazo'}</td><td className="p-4"><Link href="/admin/affiliates" className="font-bold text-action underline">Abrir afiliados</Link></td></tr>)}</tbody></table></div>;
}
