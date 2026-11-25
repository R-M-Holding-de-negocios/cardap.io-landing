import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { platformApiBase, siteProxyHeaders } from '@/lib/platform-api';

export default async function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[a-zA-Z0-9_-]{2,64}$/.test(code)) notFound();
  if (process.env.PLATFORM_API_URL) {
    try {
      const outgoing = siteProxyHeaders(await headers());
      outgoing.set('content-type', 'application/json');
      await fetch(new URL('/api/affiliates/track', platformApiBase()), {
        method: 'POST', headers: outgoing,
        body: JSON.stringify({ code }), cache: 'no-store', signal: AbortSignal.timeout(3000),
      });
    } catch { /* A contagem não impede o cadastro. */ }
  }
  redirect(`/cadastro?ref=${encodeURIComponent(code)}`);
}
