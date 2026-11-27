import { platformApi } from '@/lib/platform-api';

// Lista de espera do plano Pro (F3-T3): vira chamado na central de atendimento do admin.
export function POST(request: Request) {
  return platformApi(request, '/api/public/pro-waitlist');
}
