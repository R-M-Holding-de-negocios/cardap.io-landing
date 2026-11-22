export default function PayoutEligibilityNotice({qualifiedRestaurantCount,minimumRestaurantCount}:{qualifiedRestaurantCount:number;minimumRestaurantCount:number}){
 const eligible=qualifiedRestaurantCount>=minimumRestaurantCount;
 return <section className="rounded-2xl border border-outline bg-peach p-4 text-sm text-muted" aria-live="polite">
  <p className="font-bold text-ink">Restaurantes válidos para repasse: {qualifiedRestaurantCount} de {minimumRestaurantCount}</p>
  <p className="mt-1">Cada comissão fica em conferência por 7 dias após o pagamento. {eligible?'Os valores liberados podem ser aprovados para Pix após a conferência.':'Os valores já registrados aguardam a segunda indicação válida antes do repasse.'}</p>
 </section>;
}
