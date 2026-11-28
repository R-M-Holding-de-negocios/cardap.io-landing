// Caixa de aceite dos termos (F3-T5 do repositório Anfc-Cardapios). O servidor grava a versão;
// aqui só a marcação. O texto dos termos vem da F3-T8.
type Props = {
  name: string;
  error?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function TermsAcceptance({ name, error, checked, onChange }: Props) {
  const control = checked === undefined ? {} : { checked, onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.checked) };
  return <div className="text-sm">
    <label className="flex items-start gap-2">
      <input type="checkbox" name={name} required aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} className="mt-1 h-4 w-4 shrink-0 accent-orange-600" {...control} />
      <span>Li e aceito os <a href="/termos-de-uso" target="_blank" rel="noopener" className="font-bold text-action underline">Termos de Uso</a> e a <a href="/politica-de-privacidade" target="_blank" rel="noopener" className="font-bold text-action underline">Política de Privacidade</a>.</span>
    </label>
    {error && <span id={`${name}-error`} role="alert" className="mt-1 block text-xs font-bold text-red-700">{error}</span>}
  </div>;
}
