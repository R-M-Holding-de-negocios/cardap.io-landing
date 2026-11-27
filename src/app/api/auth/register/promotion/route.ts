import { platformApi } from '@/lib/platform-api';

export function GET(request: Request) {
  return platformApi(request, '/api/auth/register/promotion');
}
