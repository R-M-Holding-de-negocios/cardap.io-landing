// Ligação do site com a API. Regras em
// Anfc-Cardapios/docs/superpowers/specs/2026-11-25-seguranca-entre-rotas-design.md, seção 5.

const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]']);

// Em produção a API só pode ser alcançada por HTTPS, exceto no mesmo servidor (VPS).
export function platformApiBase(): URL {
  const value = process.env.PLATFORM_API_URL;
  if (!value) throw new Error('PLATFORM_API_URL não configurada');
  const url = new URL(value);
  const local = url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:' && !local) throw new Error('API deve usar HTTPS');
  return url;
}

// Prova de que a chamada veio do site (a API só atende admin, afiliado, candidatura e
// cadastro com este cabeçalho) e o IP do visitante, de que dependem os limites de tentativa.
// O valor de X-Site-Proxy nunca é copiado da requisição do navegador.
export function siteProxyHeaders(incoming?: Headers | null): Headers {
  const headers = new Headers();
  const secret = process.env.SITE_PROXY_SECRET;
  if (secret) headers.set('x-site-proxy', secret);
  const ip = incoming?.get('cf-connecting-ip');
  if (ip) headers.set('cf-connecting-ip', ip);
  return headers;
}

// Nomes com __Host- valem fora do desenvolvimento local; os antigos, em http://localhost.
export const ADMIN_COOKIES = ['__Host-cardapio_admin', 'anfc_platform_admin_session'];
export const AFFILIATE_COOKIES = ['__Host-cardapio_partner', 'anfc_affiliate_session'];

function sessionCookie(request: Request, path: string): string {
  const names = path.startsWith('/api/platform-admin/') ? ADMIN_COOKIES : path.startsWith('/api/affiliates/') ? AFFILIATE_COOKIES : null;
  if (!names) return '';
  const cookie = request.headers.get('cookie') || '';
  return cookie.split(';').map(part => part.trim()).filter(part => names.some(name => part.startsWith(`${name}=`))).join('; ');
}

function sameOriginWrite(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (origin) return origin === new URL(request.url).origin;
  return request.headers.get('sec-fetch-site') === 'same-origin';
}

export async function platformApi(request: Request, path: string): Promise<Response> {
  try {
    if (!path.startsWith('/api/')) return Response.json({ error: 'Rota inválida' }, { status: 404 });
    if (request.method !== 'GET' && request.method !== 'HEAD' && !sameOriginWrite(request)) {
      return Response.json({ error: 'Origem inválida' }, { status: 403, headers: { 'cache-control': 'no-store' } });
    }
    const url = new URL(path, platformApiBase());
    if (url.origin === new URL(request.url).origin) throw new Error('API não pode apontar para a própria landing');
    url.search = new URL(request.url).search;
    const headers = siteProxyHeaders(request.headers);
    for (const name of ['content-type', 'accept']) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const cookie = sessionCookie(request, path);
    if (cookie) headers.set('cookie', cookie);
    const upstream = await fetch(url, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
      cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(10000),
    });
    const output = new Headers({ 'cache-control': 'private, no-store' });
    for (const name of ['content-type', 'content-disposition', 'location']) {
      const value = upstream.headers.get(name);
      if (value) output.set(name, value);
    }
    for (const value of upstream.headers.getSetCookie()) {
      output.append('set-cookie', process.env.NODE_ENV === 'production' && !/;\s*secure(?:;|$)/i.test(value) ? `${value}; Secure` : value);
    }
    return new Response(upstream.body, { status: upstream.status, headers: output });
  } catch {
    return Response.json({ error: 'Serviço temporariamente indisponível.' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}
