import { CONTRACT_STATUS_LABELS, EVENT_STATUS_LABELS, IGNORE_REASON_LABELS, PAYMENT_METHOD_LABELS, billingErrorLabel, dateTime, label, money, safeInvoiceUrl } from '@/lib/platform-admin-billing';

export type BillingContract = {
  id: string; planId: string; amountCents: number; paymentMethod: string; status: string; createdAt: string; updatedAt: string;
  hasCustomer: boolean; hasPayment: boolean; hasSubscription: boolean; invoiceUrl: string | null;
  lastErrorCode: string | null; lastErrorAt: number | null;
  providerCustomerId: string | null; providerPaymentId: string | null; providerSubscriptionId: string | null;
};
export type BillingEvent = { eventType: string; processingStatus: string; ignoreReason: string | null; receivedAt: string; contractId: string | null };

const empty = 'rounded-2xl border border-outline bg-white p-5 text-muted';
const code = 'break-all font-mono text-xs';

export default function RestaurantBilling({ contracts, events }: { contracts: BillingContract[]; events: BillingEvent[] }) {
  return <div className="space-y-6">
    <section aria-labelledby="contracts-title" className="space-y-3">
      <h2 id="contracts-title" className="text-xl font-black">Contratos</h2>
      {contracts.length === 0 ? <p className={empty}>Nenhum contrato de cobrança para este restaurante.</p> : contracts.map(contract => {
        const invoice = safeInvoiceUrl(contract.invoiceUrl), failure = billingErrorLabel(contract.lastErrorCode);
        return <article key={contract.id} className="rounded-2xl border border-outline bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-black">{label(CONTRACT_STATUS_LABELS, contract.status)}</h3>
            <p className="font-bold">{money(contract.amountCents)} por mês · {label(PAYMENT_METHOD_LABELS, contract.paymentMethod)}</p>
          </div>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <div><dt className="font-bold text-muted">Plano</dt><dd>{contract.planId}</dd></div>
            <div><dt className="font-bold text-muted">Criado em</dt><dd>{dateTime(contract.createdAt)}</dd></div>
            <div><dt className="font-bold text-muted">Última mudança</dt><dd>{dateTime(contract.updatedAt)}</dd></div>
            <div><dt className="font-bold text-muted">Fatura</dt><dd>{invoice ? <a href={invoice} target="_blank" rel="noopener noreferrer" className="font-bold text-action underline">Abrir fatura no Asaas</a> : '—'}</dd></div>
            <div><dt className="font-bold text-muted">Cliente no Asaas</dt><dd className={code}>{contract.providerCustomerId || 'não criado'}</dd></div>
            <div><dt className="font-bold text-muted">Cobrança no Asaas</dt><dd className={code}>{contract.providerPaymentId || 'não criada'}</dd></div>
            <div><dt className="font-bold text-muted">Assinatura no Asaas</dt><dd className={code}>{contract.providerSubscriptionId || 'não criada'}</dd></div>
            <div><dt className="font-bold text-muted">Contrato</dt><dd className={code}>{contract.id}</dd></div>
          </dl>
          {failure && <div role="note" className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-900">
            <p className="font-bold">{failure}</p>
            <p className="mt-1">Código: <span className={code}>{contract.lastErrorCode}</span> · {dateTime(contract.lastErrorAt)}</p>
          </div>}
        </article>;
      })}
    </section>
    <section aria-labelledby="events-title" className="space-y-3">
      <h2 id="events-title" className="text-xl font-black">Eventos do Asaas</h2>
      {events.length === 0 ? <p className={empty}>Nenhum evento do Asaas registrado para este restaurante. Eventos anteriores a 25/11/2026 não guardam o restaurante.</p>
        : <div className="overflow-x-auto rounded-2xl border border-outline bg-white"><table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-peach"><tr><th className="p-4">Recebido em</th><th className="p-4">Evento</th><th className="p-4">Tratamento</th><th className="p-4">Motivo</th></tr></thead>
          <tbody>{events.map((event, index) => <tr key={`${event.receivedAt}-${index}`} className="border-t border-outline">
            <td className="p-4">{dateTime(event.receivedAt)}</td>
            <td className={`p-4 ${code}`}>{event.eventType}</td>
            <td className="p-4">{label(EVENT_STATUS_LABELS, event.processingStatus)}</td>
            <td className="p-4">{event.processingStatus === 'ignored' ? (event.ignoreReason ? label(IGNORE_REASON_LABELS, event.ignoreReason) : 'Motivo não registrado') : '—'}</td>
          </tr>)}</tbody>
        </table></div>}
    </section>
  </div>;
}
