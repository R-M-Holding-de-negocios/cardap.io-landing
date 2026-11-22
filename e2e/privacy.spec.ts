import { test, expect } from '@playwright/test';

test('first visit, rejection, persistence and reopening', async ({ page }) => {
  await page.goto('/');
  const notice = page.getByRole('region', { name: 'Preferências de privacidade' });
  await expect(notice).toBeVisible();
  await expect(notice.getByRole('button', { name: 'Aceitar todos' })).toBeVisible();
  await notice.getByRole('button', { name: 'Rejeitar opcionais' }).click();
  await expect(notice).toBeHidden();
  await page.reload();
  await expect(notice).toBeHidden();
  await page.getByRole('button', { name: 'Preferências de cookies' }).click();
  await expect(notice).toBeVisible();
  await expect(notice.getByRole('checkbox', { name: /Analíticos/ })).not.toBeChecked();
  await expect(notice.getByRole('checkbox', { name: /Publicidade/ })).not.toBeChecked();
  await notice.getByRole('checkbox', { name: /Analíticos/ }).check();
  await notice.getByRole('button', { name: 'Salvar escolhas' }).click();
  await expect(notice).toBeHidden();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('cardapio-cookie-preferences') || '{}'));
  expect(saved).toMatchObject({ version: 1, analytics: true, advertising: false });
  await page.getByRole('button', { name: 'Preferências de cookies' }).click();
  await notice.getByRole('button', { name: 'Rejeitar opcionais' }).click();
  const revoked = await page.evaluate(() => JSON.parse(localStorage.getItem('cardapio-cookie-preferences') || '{}'));
  expect(revoked).toMatchObject({ version: 1, analytics: false, advertising: false });
});

test('mobile notice is usable by keyboard and pages exist', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const notice = page.getByRole('region', { name: 'Preferências de privacidade' });
  await expect(notice).toBeVisible();
  await expect(notice.getByRole('button', { name: 'Rejeitar opcionais' })).toBeInViewport();
  await notice.getByRole('button', { name: 'Personalizar' }).focus();
  await page.keyboard.press('Enter');
  await expect(notice.getByRole('checkbox', { name: /Analíticos/ })).toBeVisible();
  await notice.getByRole('button', { name: 'Rejeitar opcionais' }).click();
  for (const [path, title] of [
    ['/termos-de-uso', 'Termos de Uso'],
    ['/politica-de-privacidade', 'Política de Privacidade'],
    ['/politica-de-cookies', 'Política de Cookies'],
  ]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();
  }
});

test('no optional third-party script loads before or after consent', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', request => { if (request.resourceType() === 'script') scripts.push(request.url()); });
  await page.goto('/');
  await page.getByRole('region', { name: 'Preferências de privacidade' }).getByRole('button', { name: 'Aceitar todos' }).click();
  expect(scripts.every(url => new URL(url).hostname === 'localhost')).toBe(true);
});
