import { afterEach, describe, expect, it, vi } from 'vitest';
import { platformApi } from '@/lib/platform-api';

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.PLATFORM_API_URL;
});

describe('ligação privada dos portais com a API', () => {
  it('encaminha somente o cookie da área administrativa', async () => {
    process.env.PLATFORM_API_URL = 'https://api.example.test';
    const send = vi.fn(async (_url: URL, _options: RequestInit) => Response.json({ user: { id: '1' } }));
    vi.stubGlobal('fetch', send);
    const request = new Request('https://landing.example.test/api/platform-admin/session', {
      headers: { cookie: 'anfc_platform_admin_session=admin; anfc_affiliate_session=affiliate; unrelated=other' },
    });
    const response = await platformApi(request, '/api/platform-admin/session');
    expect(response.status).toBe(200);
    expect(send.mock.calls[0][0].toString()).toBe('https://api.example.test/api/platform-admin/session');
    expect(new Headers(send.mock.calls[0][1].headers).get('cookie')).toBe('anfc_platform_admin_session=admin');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });

  it('recusa envio de formulário de outro site', async () => {
    process.env.PLATFORM_API_URL = 'https://api.example.test';
    const send = vi.fn();
    vi.stubGlobal('fetch', send);
    const response = await platformApi(new Request('https://landing.example.test/api/platform-admin/logout', {
      method: 'POST', headers: { origin: 'https://other.example.test' },
    }), '/api/platform-admin/logout');
    expect(response.status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });

  it('não encaminha sessões para o cadastro público', async () => {
    process.env.PLATFORM_API_URL = 'https://api.example.test';
    const send = vi.fn(async (_url: URL, _options: RequestInit) => Response.json({ success: true }));
    vi.stubGlobal('fetch', send);
    const response = await platformApi(new Request('https://landing.example.test/api/auth/register', {
      method: 'POST',
      headers: { origin: 'https://landing.example.test', cookie: 'anfc_platform_admin_session=admin; anfc_affiliate_session=affiliate' },
      body: '{}',
    }), '/api/auth/register');
    expect(response.status).toBe(200);
    expect(new Headers(send.mock.calls[0][1].headers).has('cookie')).toBe(false);
  });

  it('falha fechado sem destino configurado', async () => {
    const response = await platformApi(new Request('https://landing.example.test/api/affiliates/dashboard'), '/api/affiliates/dashboard');
    expect(response.status).toBe(502);
  });

  it('recusa configurar a própria landing como API', async () => {
    process.env.PLATFORM_API_URL = 'https://landing.example.test';
    const send = vi.fn();
    vi.stubGlobal('fetch', send);
    const response = await platformApi(new Request('https://landing.example.test/api/affiliates/dashboard'), '/api/affiliates/dashboard');
    expect(response.status).toBe(502);
    expect(send).not.toHaveBeenCalled();
  });
});
