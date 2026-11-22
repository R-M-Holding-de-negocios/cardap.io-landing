import { CheckCircle2 } from 'lucide-react';

export default function PartnerApplicationConfirmation({ applicationId }: { applicationId: string }) {
  return <div role="status" className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
    <CheckCircle2 aria-hidden="true" className="mx-auto h-12 w-12 text-emerald-600" />
    <h4 className="text-lg font-black text-muted">Candidatura recebida</h4>
    <p className="text-sm text-muted">Sua solicitação está em análise. O link de indicação e o acesso ao painel serão disponibilizados após a aprovação.</p>
    <p className="break-all text-xs text-muted">Protocolo: <strong>{applicationId}</strong></p>
  </div>;
}
