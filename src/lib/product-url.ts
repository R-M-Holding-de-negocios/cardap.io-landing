export type PlanId = 'basic' | 'essential' | 'pro';

function saasOrigin(): string {
  return process.env.NEXT_PUBLIC_SAAS_URL || 'http://localhost:3000';
}

export function productUrl(path: string): string {
  return new URL(path, saasOrigin()).toString();
}

export function planSignupUrl(planId: PlanId): string {
  const url = new URL('/cadastro', saasOrigin());
  url.searchParams.set('plan', planId);
  return url.toString();
}
