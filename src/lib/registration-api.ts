export function registrationApiUrl(): string {
  return '/api/auth/register';
}

export function registrationErrorMessage(value: unknown): string {
  return typeof value === 'string' && value.trim()
    ? value
    : 'Não foi possível criar sua conta. Tente novamente.';
}
