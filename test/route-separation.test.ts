// Segurança entre rotas no site (tarefa F2-T7 do repositório Anfc-Cardapios).
// Spec: Anfc-Cardapios/docs/superpowers/specs/2026-11-25-seguranca-entre-rotas-design.md, seção 6.
// T1 a T8 e T10 a T12 ficam na API (worker/test/identity-separation.test.ts).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const cookieJar = vi.hoisted(() => ({ value: new Map<string, string>() }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: (name: string) => cookieJar.value.has(name) ? { name, value: cookieJar.value.get(name)! } : undefined }) }));
vi.mock('next/navigation', () => ({ redirect: (target: string) => { throw new Error(`REDIRECT:${target}`); } }));
vi.mock('@/components/platform-admin/AdminShell', () => ({ default: () => null }));

import { platformApi } from '@/lib/platform-api';
import { getPlatformAdminSession } from '@/lib/platform-admin-session';
import * as affiliateRoute from '@/app/api/affiliates/[...path]/route';
import * as adminRoute from '@/app/api/platform-admin/[...path]/route';
import AdminPanelLayout from '@/app/admin/(panel)/layout';

const SITE = 'https://site.example.test';
const API = 'https://api.example.test';
const ADMIN_COOKIE = '__Host-cardapio_admin';
const AFFILIATE_COOKIE = '__Host-cardapio_partner';
const SITE_SECRET = 'test-only-site-proxy-secret-0123456789abcdef';

type Sent = { url: string; headers: Headers; method: string };
function upstream(respond: () => Response = () => Response.json({ success: true })) {
  const sent: Sent[] = [];
  const send = vi.fn(async (url: URL | string, options: RequestInit = {}) => {
    sent.push({ url: String(url), headers: new Headers(options.headers), method: options.method || 'GET' });
    return respond();
  });
  vi.stubGlobal('fetch', send);
  return { send, sent };
}
const params = (value: string) => ({ params: Promise.resolve({ path: value.split('/') }) });
const pagesUnder = (dir: string): string[] => readdirSync(dir).flatMap(name => {
  const full = path.join(dir, name);
  return statSync(full).isDirectory() ? pagesUnder(full) : name === 'page.tsx' ? [full.split(path.sep).join('/')] : [];
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  cookieJar.value = new Map();
  delete process.env.PLATFORM_API_URL;
  delete process.env.SITE_PROXY_SECRET;
});

describe('T9: páginas protegidas sem sessão', () => {
  it('o painel do admin redireciona no servidor quando não há cookie, sem consultar a API', async () => {
    process.env.PLATFORM_API_URL = API;
    const { send } = upstream();
    await expect(AdminPanelLayout({ children: 'CONTEÚDO PROTEGIDO' })).rejects.toThrow('REDIRECT:/admin/login');
    expect(send).not.toHaveBeenCalled();
  });

  it('o painel do admin redireciona quando a API não reconhece a sessão', async () => {
    process.env.PLATFORM_API_URL = API;
    cookieJar.value = new Map([[ADMIN_COOKIE, 'a'.repeat(64)], [AFFILIATE_COOKIE, 'b'.repeat(64)]]);
    const { sent } = upstream(() => Response.json({ error: 'Autenticação necessária' }, { status: 401 }));
    await expect(AdminPanelLayout({ children: 'CONTEÚDO PROTEGIDO' })).rejects.toThrow('REDIRECT:/admin/login');
    expect(sent).toHaveLength(1);
    expect(sent[0].url).toBe(`${API}/api/platform-admin/session`);
    expect(sent[0].headers.get('cookie')).toBe(`${ADMIN_COOKIE}=${'a'.repeat(64)}`);
  });

  it('toda página de /admin, exceto o login, fica atrás do layout que confere a sessão', () => {
    const pages = pagesUnder('src/app/admin');
    expect(pages.length).toBeGreaterThan(1);
    for (const page of pages) expect(page === 'src/app/admin/login/page.tsx' || page.startsWith('src/app/admin/(panel)/'), page).toBe(true);
    expect(readFileSync('src/app/admin/(panel)/layout.tsx', 'utf8')).toContain("redirect('/admin/login')");
  });

  it('o portal do afiliado só tem telas de login e redefinição, sem dado vindo do servidor', () => {
    const pages = pagesUnder('src/app/partner').sort();
    expect(pages).toEqual(['src/app/partner/login/page.tsx', 'src/app/partner/reset/page.tsx']);
    for (const file of [...pages, 'src/app/partner/layout.tsx']) {
      const source = readFileSync(file, 'utf8');
      // Nada de sessão nem de consulta à API durante a renderização no servidor:
      // o que aparece depois do login vem de /api/affiliates/*, autorizado pela API a cada chamada.
      expect(source, file).not.toMatch(/next\/headers|PLATFORM_API_URL|platform-api/);
    }
    for (const page of pages) expect(readFileSync(page, 'utf8').trimStart().startsWith("'use client'"), page).toBe(true);
  });
});

describe('T13: proxies de lista fechada', () => {
  it('o proxy de afiliado não encaminha caminho ou método fora da lista', async () => {
    process.env.PLATFORM_API_URL = API;
    const { send } = upstream();
    const refused: [string, string][] = [
      ['GET', 'login'], ['POST', 'dashboard'], ['GET', 'track'], ['GET', 'password/change'], ['POST', 'password/outra'],
      ['GET', '../platform-admin/session'], ['GET', 'dashboard/extra'], ['POST', 'login/..'], ['GET', '..'],
    ];
    for (const [method, key] of refused) {
      const response = await affiliateRoute[method as 'GET' | 'POST'](new Request(`${SITE}/api/affiliates/${key}`, { method, headers: { origin: SITE } }), params(key));
      expect(response.status, `${method} ${key}`).toBe(404);
    }
    expect(send).not.toHaveBeenCalled();
    expect((await affiliateRoute.GET(new Request(`${SITE}/api/affiliates/dashboard`), params('dashboard'))).status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('o proxy de admin não encaminha caminho ou método fora da lista', async () => {
    process.env.PLATFORM_API_URL = API;
    const { send, sent } = upstream();
    const refused: [string, string][] = [
      ['GET', 'login'], ['POST', 'overview'], ['POST', 'restaurants/r1/delete'], ['GET', '../auth/session'],
      ['GET', '../affiliates/dashboard'], ['GET', 'restaurants/r1/extra/mais'], ['POST', 'affiliates/a1/pix-key'],
    ];
    for (const [method, key] of refused) {
      const response = await adminRoute[method as 'GET' | 'POST'](new Request(`${SITE}/api/platform-admin/${key}`, { method, headers: { origin: SITE } }), params(key));
      expect(response.status, `${method} ${key}`).toBe(404);
    }
    expect(send).not.toHaveBeenCalled();
    expect((await adminRoute.GET(new Request(`${SITE}/api/platform-admin/overview`), params('overview'))).status).toBe(200);
    expect(sent[0].url).toBe(`${API}/api/platform-admin/overview`);
  });
});

describe('T14: cada chamada leva só o cookie da própria área', () => {
  const both = `${ADMIN_COOKIE}=admin-token; ${AFFILIATE_COOKIE}=affiliate-token; __Host-cardapio_session=restaurant-token; anfc_session=restaurant-token; outro=x`;

  it('admin leva só o de admin; afiliado só o de afiliado', async () => {
    process.env.PLATFORM_API_URL = API;
    const { sent } = upstream();
    await adminRoute.GET(new Request(`${SITE}/api/platform-admin/overview`, { headers: { cookie: both } }), params('overview'));
    await affiliateRoute.GET(new Request(`${SITE}/api/affiliates/dashboard`, { headers: { cookie: both } }), params('dashboard'));
    expect(sent[0].headers.get('cookie')).toBe(`${ADMIN_COOKIE}=admin-token`);
    expect(sent[1].headers.get('cookie')).toBe(`${AFFILIATE_COOKIE}=affiliate-token`);
  });

  it('em desenvolvimento local os nomes sem prefixo seguem a mesma separação', async () => {
    process.env.PLATFORM_API_URL = API;
    const { sent } = upstream();
    const local = 'anfc_platform_admin_session=admin-token; anfc_affiliate_session=affiliate-token; anfc_session=restaurant-token';
    await adminRoute.GET(new Request(`${SITE}/api/platform-admin/overview`, { headers: { cookie: local } }), params('overview'));
    await affiliateRoute.GET(new Request(`${SITE}/api/affiliates/dashboard`, { headers: { cookie: local } }), params('dashboard'));
    expect(sent[0].headers.get('cookie')).toBe('anfc_platform_admin_session=admin-token');
    expect(sent[1].headers.get('cookie')).toBe('anfc_affiliate_session=affiliate-token');
  });

  it('cadastro e candidatura não levam nenhum cookie', async () => {
    process.env.PLATFORM_API_URL = API;
    const { sent } = upstream();
    for (const target of ['/api/auth/register', '/api/partners/apply']) {
      await platformApi(new Request(`${SITE}${target}`, { method: 'POST', headers: { origin: SITE, cookie: both, 'content-type': 'application/json' }, body: '{}' }), target);
    }
    expect(sent).toHaveLength(2);
    for (const call of sent) expect(call.headers.has('cookie'), call.url).toBe(false);
  });
});

describe('T15: prova da porta do site e IP do cliente', () => {
  it('envia o cabeçalho do site com o segredo e repassa o CF-Connecting-IP recebido', async () => {
    process.env.PLATFORM_API_URL = API;
    process.env.SITE_PROXY_SECRET = SITE_SECRET;
    const { sent } = upstream();
    await platformApi(new Request(`${SITE}/api/affiliates/login`, {
      method: 'POST', headers: { origin: SITE, 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.7' }, body: '{}',
    }), '/api/affiliates/login');
    expect(sent[0].headers.get('x-site-proxy')).toBe(SITE_SECRET);
    expect(sent[0].headers.get('cf-connecting-ip')).toBe('203.0.113.7');
  });

  it('não repassa X-Site-Proxy vindo do cliente', async () => {
    process.env.PLATFORM_API_URL = API;
    process.env.SITE_PROXY_SECRET = SITE_SECRET;
    const { sent } = upstream();
    await platformApi(new Request(`${SITE}/api/affiliates/dashboard`, { headers: { 'x-site-proxy': 'valor-do-cliente', 'cf-connecting-ip': '203.0.113.8' } }), '/api/affiliates/dashboard');
    expect(sent[0].headers.get('x-site-proxy')).toBe(SITE_SECRET);
  });

  it('sem segredo configurado, o valor do cliente não passa', async () => {
    process.env.PLATFORM_API_URL = API;
    const { sent } = upstream();
    await platformApi(new Request(`${SITE}/api/affiliates/dashboard`, { headers: { 'x-site-proxy': 'valor-do-cliente' } }), '/api/affiliates/dashboard');
    expect(sent[0].headers.has('x-site-proxy')).toBe(false);
  });

  it('a conferência de sessão do painel também se identifica como site', async () => {
    process.env.PLATFORM_API_URL = API;
    process.env.SITE_PROXY_SECRET = SITE_SECRET;
    cookieJar.value = new Map([[ADMIN_COOKIE, 'a'.repeat(64)]]);
    const { sent } = upstream(() => Response.json({ user: { id: '1', email: 'admin@example.test' } }));
    await getPlatformAdminSession();
    expect(sent[0].headers.get('x-site-proxy')).toBe(SITE_SECRET);
  });
});

describe('T16: endereço da API em produção', () => {
  const dashboard = () => platformApi(new Request(`${SITE}/api/affiliates/dashboard`), '/api/affiliates/dashboard');

  it('aceita http só para endereço local', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    for (const local of ['http://127.0.0.1:8787', 'http://localhost:8787', 'http://[::1]:8787']) {
      process.env.PLATFORM_API_URL = local;
      const { sent } = upstream();
      expect((await dashboard()).status, local).toBe(200);
      expect(sent[0].url, local).toBe(`${local}/api/affiliates/dashboard`);
    }
  });

  it('recusa http para qualquer outro host', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    for (const remote of ['http://exemplo.com', 'http://127.0.0.1.exemplo.com', 'http://10.0.0.5:8787']) {
      process.env.PLATFORM_API_URL = remote;
      const { send } = upstream();
      expect((await dashboard()).status, remote).toBe(502);
      expect(send, remote).not.toHaveBeenCalled();
    }
  });

  it('a conferência de sessão do painel segue a mesma regra', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    cookieJar.value = new Map([[ADMIN_COOKIE, 'a'.repeat(64)]]);
    process.env.PLATFORM_API_URL = 'http://127.0.0.1:8787';
    upstream(() => Response.json({ user: { id: '1', email: 'admin@example.test' } }));
    await expect(getPlatformAdminSession()).resolves.toEqual({ id: '1', email: 'admin@example.test' });
    process.env.PLATFORM_API_URL = 'http://exemplo.com';
    const { send } = upstream();
    await expect(getPlatformAdminSession()).rejects.toThrow();
    expect(send).not.toHaveBeenCalled();
  });
});

describe('complemento do T10 no site (spec 5.3, V2): origem das escritas no proxy', () => {
  const logout = (headers: Record<string, string>) => platformApi(new Request(`${SITE}/api/platform-admin/logout`, { method: 'POST', headers }), '/api/platform-admin/logout');

  it('recusa escrita sem Origin e sem Sec-Fetch-Site', async () => {
    process.env.PLATFORM_API_URL = API;
    const { send } = upstream();
    expect((await logout({})).status).toBe(403);
    expect((await logout({ 'sec-fetch-site': 'cross-site' })).status).toBe(403);
    expect((await logout({ origin: 'https://outro.example.test' })).status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });

  it('aceita escrita com Origin do próprio site ou Sec-Fetch-Site same-origin', async () => {
    process.env.PLATFORM_API_URL = API;
    const { send } = upstream();
    expect((await logout({ origin: SITE })).status).toBe(200);
    expect((await logout({ 'sec-fetch-site': 'same-origin' })).status).toBe(200);
    expect(send).toHaveBeenCalledTimes(2);
  });
});
