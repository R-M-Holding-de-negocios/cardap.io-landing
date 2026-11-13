import { notFound, redirect } from 'next/navigation';

export default async function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[a-zA-Z0-9_-]{2,64}$/.test(code)) notFound();
  redirect(`/cadastro?ref=${encodeURIComponent(code)}`);
}
