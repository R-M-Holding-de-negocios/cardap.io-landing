import { EVENT_STATUS_LABELS, IGNORE_REASON_LABELS, dateTime, eventTypeLabel, label } from '@/lib/platform-admin-billing';

export type AsaasEvent = {
  eventType: string; processingStatus: string; ignoreReason: string | null; receivedAt: string;
  contractId: string | null; establishmentId: string | null; restaurantName: string | null; stalled: boolean;
};

// Eventos do Asaas recebidos pelo sistema (F3-T20). O corpo do evento não é guardado nem exibido.
export default function AsaasEventsTable({ items }: { items: AsaasEvent[] }) {
  if (items.length === 0) return <p className="rounded-2xl border border-outline bg-white p-6 text-muted">Nenhum evento do Asaas para este filtro.</p>;
  return <div className="overflow-x-auto rounded-2xl border border-outline bg-white"><table className="w-full min-w-[820px] text-left text-sm">
    <thead className="bg-peach"><tr><th className="p-4">Recebido em</th><th className="p-4">Evento</th><th className="p-4">Tratamento</th><th className="p-4">Motivo</th><th className="p-4">Restaurante</th></tr></thead>
    <tbody>{items.map((event, index) => <tr key={`${event.receivedAt}-${index}`} className={`border-t border-outline ${event.stalled ? 'bg-red-50' : ''}`}>
      <td className="p-4">{dateTime(event.receivedAt)}</td>
      <td className="break-all p-4 font-mono text-xs">{eventTypeLabel(event.eventType)}</td>
      <td className="p-4">{label(EVENT_STATUS_LABELS, event.processingStatus)}{event.stalled && <span className="mt-1 block w-fit rounded-full border border-red-300 bg-white px-2 py-0.5 text-xs font-bold text-red-800">Tratamento interrompido</span>}</td>
      <td className="p-4">{event.processingStatus === 'ignored' ? (event.ignoreReason ? label(IGNORE_REASON_LABELS, event.ignoreReason) : 'Motivo não registrado') : '—'}</td>
      <td className="p-4">{event.establishmentId ? <a href={`/admin/restaurants/${encodeURIComponent(event.establishmentId)}`} className="font-bold text-action underline">{event.restaurantName || 'Sem nome'}</a> : '—'}</td>
    </tr>)}</tbody>
  </table></div>;
}
