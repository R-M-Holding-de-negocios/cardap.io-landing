import { describe, expect, it } from 'vitest';
import { platformAdminPathAllowed } from '@/lib/platform-admin-paths';

describe('rotas administrativas expostas pela landing', () => {
  it('permite apenas consultas e ações previstas no painel', () => {
    expect(platformAdminPathAllowed('GET', ['overview'])).toBe(true);
    expect(platformAdminPathAllowed('GET', ['payouts', 'due'])).toBe(true);
    expect(platformAdminPathAllowed('POST', ['restaurants', 'rest-1', 'suspend'])).toBe(true);
    expect(platformAdminPathAllowed('POST', ['restaurants', 'rest-1', 'delete'])).toBe(false);
    expect(platformAdminPathAllowed('GET', ['..', 'auth', 'session'])).toBe(false);
    expect(platformAdminPathAllowed('PUT', ['affiliates', 'affiliate-1'])).toBe(false);
  });
});
