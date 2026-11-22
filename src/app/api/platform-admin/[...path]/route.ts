import { platformApi } from '@/lib/platform-api';
import { platformAdminPathAllowed } from '@/lib/platform-admin-paths';

async function handle(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  if (!platformAdminPathAllowed(request.method, path)) return Response.json({ error: 'Rota não encontrada' }, { status: 404 });
  return platformApi(request, `/api/platform-admin/${path.map(encodeURIComponent).join('/')}`);
}

export const GET = handle;
export const POST = handle;
