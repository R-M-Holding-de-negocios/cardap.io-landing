// Validação de CPF/CNPJ e senha (F3-T6, spec docs/superpowers/specs/2026-11-27-validacao-cpf-cnpj-senha-design.md).
// Usada pelo servidor (worker/src/auth.ts). A landing tem uma cópia idêntica, com o mesmo teste:
// mudou aqui, mude lá (LANDING/src/lib/cpf-cnpj.ts).

/** Tira espaços, ponto, barra e hífen; letras viram maiúsculas (CNPJ alfanumérico). */
export function normalizeCpfCnpj(value: string): string {
  return value.replace(/[\s./-]/g, '').toUpperCase();
}

const repeated = (value: string) => [...value].every(char => char === value[0]);
// Valor de cada caractere: código ASCII menos 48 (dígitos 0–9, letras A=17 … Z=42), regra da Receita.
const charValue = (char: string) => char.charCodeAt(0) - 48;

function cpfOk(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || repeated(cpf)) return false;
  for (const length of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(cpf[i]) * (length + 1 - i);
    const digit = (sum * 10) % 11 % 10;
    if (digit !== Number(cpf[length])) return false;
  }
  return true;
}

function cnpjOk(cnpj: string) {
  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || repeated(cnpj)) return false;
  for (const length of [12, 13]) {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += charValue(cnpj[i]) * (2 + ((length - 1 - i) % 8));
    const rest = sum % 11, digit = rest < 2 ? 0 : 11 - rest;
    if (digit !== Number(cnpj[length])) return false;
  }
  return true;
}

/** Documento normalizado se válido; null se não. */
export function validCpfCnpj(value: string): string | null {
  const doc = normalizeCpfCnpj(value);
  return (doc.length === 11 ? cpfOk(doc) : doc.length === 14 && cnpjOk(doc)) ? doc : null;
}

/** Mensagem do campo, ou null se o documento vale. */
export function cpfCnpjProblem(value: string): string | null {
  const doc = normalizeCpfCnpj(value);
  if (!doc) return 'Informe o CPF ou o CNPJ.';
  if (doc.length !== 11 && doc.length !== 14) return 'O CPF tem 11 números e o CNPJ tem 14 caracteres.';
  if (validCpfCnpj(doc)) return null;
  return doc.length === 11 ? 'CPF inválido. Confira os números.' : 'CNPJ inválido. Confira os caracteres.';
}

export const PASSWORD_MIN_CHARS = 12, PASSWORD_MAX_BYTES = 72;

/** Mínimo em caracteres, máximo em bytes UTF-8 (limite do bcrypt), igual nos dois lados. */
export function passwordProblem(password: string): string | null {
  if (password.length < PASSWORD_MIN_CHARS) return 'Use ao menos 12 caracteres.';
  if (new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES) return 'A senha passou do tamanho máximo. Letras com acento e emojis ocupam mais espaço; use até 72 letras sem acento.';
  return null;
}
