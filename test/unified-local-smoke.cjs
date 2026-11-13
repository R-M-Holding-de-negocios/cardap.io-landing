const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.getByRole('heading', { level: 1 }).waitFor();
    for (const route of ['/', '/login', '/cadastro?plan=basic', '/cadastro?plan=essential', '/cadastro?plan=pro', '/recursos', '/parceiros', '/partner/login', '/atendimento']) {
      await page.goto(`http://localhost:3000${route}`);
      const external = await page.locator('a[href^="http://"], a[href^="https://"]').evaluateAll(links => links.map(link => link.href).filter(href => !href.startsWith('http://localhost:3000/')));
      if (external.length) throw new Error(`External links on ${route}: ${external.join(', ')}`);
    }
    await page.goto('http://localhost:3000/');
    await page.locator('#simulador').scrollIntoViewIfNeeded();
    for (const number of [2, 3, 4, 1]) {
      await page.getByRole('button', { name: new RegExp(`Passo ${number}`) }).click();
      const invisibleCopy = await page.locator('#simulador [role="tabpanel"] p').evaluateAll(nodes => nodes.filter(node => {
        const style = getComputedStyle(node);
        return Number(style.opacity) < 0.95 || node.getBoundingClientRect().height === 0;
      }).map(node => node.textContent));
      if (invisibleCopy.length) throw new Error(`Invisible text in step ${number}: ${invisibleCopy.join(' | ')}`);
    }
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.getByRole('button', { name: 'Ativar tema escuro' }).first().click();
    await page.waitForFunction(() => document.documentElement.classList.contains('landing-organic-theme-transition'));
    const beforeScroll = await page.evaluate(() => window.scrollY);
    const locked = await page.evaluate(() => document.documentElement.style.overflow === 'hidden' && document.body.style.overflow === 'hidden');
    if (!locked) throw new Error('Scroll was not locked during the organic theme reveal.');
    await page.mouse.wheel(0, 180);
    const afterScroll = await page.evaluate(() => window.scrollY);
    if (afterScroll !== beforeScroll) throw new Error('Page scrolled before the theme reveal completed.');
    await page.waitForFunction(() => !document.documentElement.classList.contains('landing-organic-theme-transition'));
    await page.evaluate(() => window.scrollBy(0, 180));
    if (await page.evaluate(() => window.scrollY) <= beforeScroll) throw new Error('Scroll did not unlock after the theme reveal.');
    await page.getByRole('link', { name: 'Entrar', exact: true }).first().click();
    await page.waitForURL('http://localhost:3000/login');
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Continuar com o Pro' }).click();
    await page.waitForURL('http://localhost:3000/cadastro?plan=pro');
    await page.goto('http://localhost:3000/r/PARCEIRO25');
    await page.waitForURL('http://localhost:3000/cadastro?ref=PARCEIRO25');
    console.log('Home → login, Pro signup and referral stayed on localhost:3000; theme persisted.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
