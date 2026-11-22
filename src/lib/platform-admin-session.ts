import { cookies } from 'next/headers';

export async function getPlatformAdminSession(): Promise<{ id: string; email: string } | null> {
  const token = (await cookies()).get('anfc_platform_admin_session')?.value;
  if (!token) return null;
  const base = process.env.PLATFORM_API_URL;
  if (!base) throw new Error('PLATFORM_API_URL não configurada');
  const url = new URL('/api/platform-admin/session', base);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('API deve usar HTTPS');
  const response = await fetch(url, { headers: { cookie: `anfc_platform_admin_session=${token}` }, cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error('Serviço de autenticação indisponível');
  const data = await response.json() as { user: { id: string; email: string } };
  return data.user;
}
