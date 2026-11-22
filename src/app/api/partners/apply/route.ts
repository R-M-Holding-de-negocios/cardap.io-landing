import { platformApi } from '@/lib/platform-api';

export function POST(request: Request) {
  return platformApi(request, '/api/partners/apply');
}
