import { notFound, redirect } from 'next/navigation';

export default async function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[a-zA-Z0-9_-]{2,64}$/.test(code)) notFound();
  const base = process.env.PLATFORM_API_URL;
  if (base) {
    try {
      await fetch(new URL('/api/affiliates/track', base), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }), cache: 'no-store', signal: AbortSignal.timeout(3000),
      });
    } catch { /* A contagem não impede o cadastro. */ }
  }
  redirect(`/cadastro?ref=${encodeURIComponent(code)}`);
}
