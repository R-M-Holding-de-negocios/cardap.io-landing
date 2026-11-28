// Link de emergência para o dono ou gerente redefinir a senha (F3-T9 do repositório Anfc-Cardapios).
// O token vai no fragmento (#), que não chega a servidor, registro de acesso nem Referer.
import { productUrl } from './product-url';

export function accessResetLink(token: string): string | null {
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  return `${productUrl('/redefinir-senha')}#${token}`;
}
