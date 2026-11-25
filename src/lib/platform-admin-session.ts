import { cookies } from 'next/headers';
import { ADMIN_COOKIES, platformApiBase, siteProxyHeaders } from './platform-api';

export async function getPlatformAdminSession(): Promise<{ id: string; email: string } | null> {
  const jar = await cookies();
  const name = ADMIN_COOKIES.find(candidate => jar.get(candidate)?.value);
  if (!name) return null;
  const url = new URL('/api/platform-admin/session', platformApiBase());
  const headers = siteProxyHeaders();
  headers.set('cookie', `${name}=${jar.get(name)!.value}`);
  const response = await fetch(url, { headers, cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error('Serviço de autenticação indisponível');
  const data = await response.json() as { user: { id: string; email: string } };
  return data.user;
}
