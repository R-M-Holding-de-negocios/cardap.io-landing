function apiBase(): URL {
  const value = process.env.PLATFORM_API_URL;
  if (!value) throw new Error('PLATFORM_API_URL não configurada');
  const url = new URL(value);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('API deve usar HTTPS');
  return url;
}

function sessionCookie(request: Request, path: string): string {
  const name = path.startsWith('/api/platform-admin/') ? 'anfc_platform_admin_session' : path.startsWith('/api/affiliates/') ? 'anfc_affiliate_session' : null;
  if (!name) return '';
  const cookie = request.headers.get('cookie') || '';
  return cookie.split(';').map(part => part.trim()).filter(part => part.startsWith(`${name}=`)).join('; ');
}

export async function platformApi(request: Request, path: string): Promise<Response> {
  try {
    if (!path.startsWith('/api/')) return Response.json({ error: 'Rota inválida' }, { status: 404 });
    const origin = request.headers.get('origin');
    if (request.method !== 'GET' && request.method !== 'HEAD' && origin && origin !== new URL(request.url).origin) {
      return Response.json({ error: 'Origem inválida' }, { status: 403, headers: { 'cache-control': 'no-store' } });
    }
    const url = new URL(path, apiBase());
    if (url.origin === new URL(request.url).origin) throw new Error('API não pode apontar para a própria landing');
    url.search = new URL(request.url).search;
    const headers = new Headers();
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
