// Botão "Preencher dados de teste" do cadastro (pedido do João em 27/11/2026). Dados fictícios,
// para homologar sem criar conta à mão. Nunca aparece em produção.

/** Liberado só no Preview da Vercel (homologação) e no desenvolvimento local. */
export function testFillEnabled(env: { VERCEL_ENV?: string; NODE_ENV?: string }) {
  return env.VERCEL_ENV === 'preview' || env.NODE_ENV === 'development';
}

const randomInt = (max: number) => crypto.getRandomValues(new Uint32Array(1))[0] % max;
const pick = <T,>(items: readonly T[]) => items[randomInt(items.length)];
const digits = (count: number) => Array.from({ length: count }, () => randomInt(10)).join('');

/** CPF fictício com dígitos verificadores válidos. */
function randomCpf() {
  let base: number[];
  do base = Array.from({ length: 9 }, () => randomInt(10)); while (base.every(d => d === base[0]));
  for (const len of [9, 10]) {
    let sum = 0; for (let i = 0; i < len; i++) sum += base[i] * (len + 1 - i);
    const rest = (sum * 10) % 11; base.push(rest === 10 ? 0 : rest);
  }
  return base.join('');
}

const kinds = ['Restaurante', 'Bistrô', 'Cantina', 'Lanchonete', 'Pizzaria', 'Café'] as const;
const names = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabi', 'Hugo'] as const;
const surnames = ['Souza', 'Lima', 'Rocha', 'Alves', 'Costa', 'Pereira'] as const;

export function randomSignupData() {
  const id = `${Date.now().toString(36)}${digits(4)}`;
  return {
    restaurantName: `${pick(kinds)} Teste ${id.slice(-4)}`,
    ownerName: `${pick(names)} ${pick(surnames)}`,
    email: `teste-${id}@example.com`,
    phone: `(11) 9${digits(4)}-${digits(4)}`,
    cpfCnpj: randomCpf(),
    password: `Teste-${digits(8)}`,
  };
}
