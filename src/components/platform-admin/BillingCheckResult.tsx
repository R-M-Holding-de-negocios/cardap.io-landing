import { CONTRACT_STATUS_LABELS, PAYMENT_METHOD_LABELS, billingDifferenceLabel, label, money } from '@/lib/platform-admin-billing';

export type BillingCheck = {
  differences: string[];
  database: { contractId: string; contractStatus: string; accountStatus: string; paymentMethod: string; amountCents: number; hasPayment: boolean; hasSubscription: boolean };
  asaas: { paymentStatus: string | null; paymentDeleted: boolean; subscriptionStatus: string | null; subscriptionId: string | null };
};

export default function BillingCheckResult({ result }: { result: BillingCheck }) {
  const agreed = result.differences.length === 1 && result.differences[0] === 'none';
  return <div className="space-y-3 rounded-2xl border border-outline bg-white p-5 text-sm">
    <h3 className="text-lg font-black">Conferência com o Asaas</h3>
    {agreed
      ? <p className="font-bold">O sistema e o Asaas estão de acordo.</p>
      : <ul className="list-disc space-y-1 pl-5 font-bold text-red-900">{result.differences.map(code => <li key={code}>{billingDifferenceLabel(code)}</li>)}</ul>}
    <div className="grid gap-4 sm:grid-cols-2">
      <dl className="space-y-1">
        <dt className="font-black">No sistema</dt>
        <dd>Contrato: {label(CONTRACT_STATUS_LABELS, result.database.contractStatus)}</dd>
        <dd>Conta: {result.database.accountStatus || '—'}</dd>
        <dd>{money(result.database.amountCents)} · {label(PAYMENT_METHOD_LABELS, result.database.paymentMethod)}</dd>
        <dd>Assinatura vinculada: {result.database.hasSubscription ? 'sim' : 'não'}</dd>
      </dl>
      <dl className="space-y-1">
        <dt className="font-black">No Asaas, agora</dt>
        <dd>Cobrança: {result.asaas.paymentDeleted ? 'apagada' : result.asaas.paymentStatus || 'não existe'}</dd>
        <dd>Assinatura: {result.asaas.subscriptionStatus || 'não existe'}</dd>
        {result.asaas.subscriptionId && <dd className="break-all font-mono text-xs">{result.asaas.subscriptionId}</dd>}
      </dl>
    </div>
  </div>;
}
