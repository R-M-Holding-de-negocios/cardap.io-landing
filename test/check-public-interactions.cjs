const { chromium } = require('playwright');

const siteUrl = process.env.SITE_URL || 'http://localhost:3001';

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(siteUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('#simulador').scrollIntoViewIfNeeded();

    const steps = [];
    for (const number of [1, 2, 3, 4, 1]) {
      await page.getByRole('button', { name: new RegExp(`Passo ${number}`) }).click();
      await page.waitForTimeout(100);
      const hiddenText = await page.locator('#simulador [role="tabpanel"] :is(h1,h2,h3,h4,p,li)').evaluateAll(nodes => nodes.filter(node => {
        const style = getComputedStyle(node);
        return Number(style.opacity) < 0.95 || style.visibility !== 'visible' || node.getBoundingClientRect().height === 0;
      }).map(node => node.textContent?.trim()));
      steps.push({ number, hiddenText });
    }

    await page.getByRole('button', { name: 'Ativar tema escuro' }).first().click();
    await page.waitForFunction(() => document.documentElement.classList.contains('landing-organic-theme-transition'));
    const during = await page.evaluate(() => ({
      htmlOverflow: document.documentElement.style.overflow,
      bodyOverflow: document.body.style.overflow,
      scrollY: window.scrollY,
    }));
    await page.mouse.wheel(0, 180);
    await page.waitForTimeout(100);
    during.afterWheelY = await page.evaluate(() => window.scrollY);
    await page.waitForFunction(() => !document.documentElement.classList.contains('landing-organic-theme-transition'));
    const after = await page.evaluate(() => ({
      htmlOverflow: document.documentElement.style.overflow,
      bodyOverflow: document.body.style.overflow,
      scrollY: window.scrollY,
    }));
    await page.mouse.wheel(0, 180);
    await page.waitForTimeout(100);
    after.afterWheelY = await page.evaluate(() => window.scrollY);
    const result = { siteUrl, steps, during, after };
    console.log(JSON.stringify(result, null, 2));
    if (steps.some(step => step.hiddenText.length) || during.htmlOverflow !== 'hidden' || during.bodyOverflow !== 'hidden' || during.afterWheelY !== during.scrollY || after.afterWheelY <= after.scrollY) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
