import { afterEach, describe, expect, it, vi } from 'vitest';
import { planSignupUrl, productUrl } from '@/lib/product-url';

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

  it.each([
    ['basic', 'http://localhost:3000/cadastro?plan=basic'],
    ['essential', 'http://localhost:3000/cadastro?plan=essential'],
    ['pro', 'http://localhost:3000/cadastro?plan=pro'],
  ] as const)('sends the %s plan to the matching SaaS signup', (planId, expected) => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SAAS_URL', '');
    expect(planSignupUrl(planId)).toBe(expected);
  });
});
