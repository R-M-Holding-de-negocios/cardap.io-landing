import { expect, it } from 'vitest';
import { registrationApiUrl, registrationErrorMessage } from '@/lib/registration-api';

it('envia o cadastro pelo servidor da landing', () => {
  expect(registrationApiUrl()).toBe('/api/auth/register');
});

it('não mostra objetos de erro como texto no formulário', () => {
  expect(registrationErrorMessage({ code: '401', message: 'Protected deployment' }))
    .toBe('Não foi possível criar sua conta. Tente novamente.');
});
