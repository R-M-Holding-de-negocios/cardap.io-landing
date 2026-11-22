import { expect, it } from 'vitest';
import { registrationApiUrl } from '@/lib/registration-api';

it('envia o cadastro pelo servidor da landing', () => {
  expect(registrationApiUrl()).toBe('/api/auth/register');
});
