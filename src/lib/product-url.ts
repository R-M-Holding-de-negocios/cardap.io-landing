export type PlanId = 'basic' | 'essential' | 'pro';

function saasOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SAAS_URL?.trim();
  const publicSite = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const hosted=process.env.VERCEL_ENV==='production'||process.env.VERCEL_ENV==='preview';
  if(hosted&&!configured)throw new Error('Hosted build requires NEXT_PUBLIC_SAAS_URL');
  if(hosted&&configured&&new URL(configured).protocol!=='https:')throw new Error('Hosted build requires an HTTPS SaaS destination');
  if (publicSite) {
    const site = new URL(publicSite);
    if (site.protocol === 'https:' && !['localhost', '127.0.0.1'].includes(site.hostname)) {
      if (!configured) throw new Error('Public build requires NEXT_PUBLIC_SAAS_URL');
      const destination = new URL(configured);
      if (destination.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(destination.hostname)) {
        throw new Error('Public build requires an HTTPS SaaS destination');
      }
      if(destination.origin===site.origin)throw new Error('Public build requires a separate SaaS destination');
    }
  }
  return configured || 'http://localhost:3000';
}

export function productUrl(path: string): string {
  return new URL(path, saasOrigin()).toString();
}

export function signupUrl(): string {
  return '/cadastro';
}

export function planSignupUrl(planId: PlanId): string {
  return `${signupUrl()}?plan=${encodeURIComponent(planId)}`;
}
