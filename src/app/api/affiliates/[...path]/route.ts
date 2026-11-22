import { platformApi } from '@/lib/platform-api';

const getPaths = new Set(['dashboard', 'ledger']);
const postPaths = new Set(['login', 'logout', 'password/change', 'password/reset']);

async function handle(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const key = path.join('/');
  if (!(request.method === 'GET' ? getPaths : postPaths).has(key)) return Response.json({ error: 'Rota não encontrada' }, { status: 404 });
  return platformApi(request, `/api/affiliates/${key}`);
}

export const GET = handle;
export const POST = handle;
