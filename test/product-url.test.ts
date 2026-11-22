import { afterEach, describe, expect, it, vi } from 'vitest';
import { planSignupUrl, productUrl, signupUrl } from '@/lib/product-url';

afterEach(() => vi.unstubAllEnvs());

describe('SaaS destinations', () => {
  it('keeps the configured local destination in a production build', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SAAS_URL', 'http://localhost:9999');

    expect(productUrl('/login')).toBe('http://localhost:9999/login');
    expect(productUrl('/cadastro')).toBe('http://localhost:9999/cadastro');
  });

  it('supports a configurable local SaaS address during development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_SAAS_URL', 'http://localhost:3002');

    expect(productUrl('/login')).toBe('http://localhost:3002/login');
    expect(productUrl('/parceiros')).toBe('http://localhost:3002/parceiros');
  });

  it('uses a local default when no address is configured, including production builds', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SAAS_URL', '');

    expect(productUrl('/cadastro')).toBe('http://localhost:3000/cadastro');
  });

  it('blocks public builds that would send visitors to a local or insecure SaaS address', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://mycardap.io');
    vi.stubEnv('NEXT_PUBLIC_SAAS_URL', '');
    expect(() => productUrl('/cadastro')).toThrow();
    vi.stubEnv('NEXT_PUBLIC_SAAS_URL', 'http://localhost:3000');
    expect(() => productUrl('/login')).toThrow();
    vi.stubEnv('NEXT_PUBLIC_SAAS_URL', 'https://mycardap.io');
    expect(() => productUrl('/login')).toThrow();
    vi.stubEnv('NEXT_PUBLIC_SAAS_URL', 'https://app.mycardap.io');
    expect(productUrl('/login')).toBe('https://app.mycardap.io/login');
  });

  it('also blocks an unconfigured Vercel production build without a site URL variable', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SAAS_URL', '');
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(() => productUrl('/login')).toThrow();
  });

  it('keeps the restaurant signup on the landing', () => {
    expect(signupUrl()).toBe('/cadastro');
  });

  it.each([
    ['basic', '/cadastro?plan=basic'],
    ['essential', '/cadastro?plan=essential'],
    ['pro', '/cadastro?plan=pro'],
  ] as const)('keeps the %s plan on the landing signup', (planId, expected) => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SAAS_URL', '');
    expect(planSignupUrl(planId)).toBe(expected);
  });
});
