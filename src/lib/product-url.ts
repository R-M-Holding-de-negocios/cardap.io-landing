const SAAS_ORIGIN = 'https://cardap.io';

export function productUrl(path: string): string {
  return new URL(path, SAAS_ORIGIN).toString();
}
