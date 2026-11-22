const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value/100);
export default function PartnerFinancialSummary({earningsCents,balanceCents,availableCents,paidCents}:{earningsCents:number;balanceCents:number;availableCents:number;paidCents:number}){
 return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Comissões registradas',earningsCents],['Saldo após reservas',balanceCents],['Disponível para repasse',availableCents],['Repasses pagos',paidCents]].map(([label,value])=><section key={label} className="rounded-3xl bg-white border border-outline p-6"><h2 className="text-sm font-bold text-muted">{label}</h2><p className="text-3xl font-black">{money(Number(value))}</p></section>)}</div>;
}
