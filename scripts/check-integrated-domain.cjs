const fs = require('node:fs');
const path = require('node:path');

const frontend = process.env.INTEGRATED_FRONTEND_DIR || 'C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend';
const failures = [];
const read = relative => fs.readFileSync(path.join(frontend, relative), 'utf8');

const layout = read('src/app/layout.tsx');
if (!layout.includes('https://mycardap.io')) failures.push('layout: missing public origin');
if (!layout.includes('og-cardapio.png')) failures.push('layout: missing social image metadata');
if (!layout.includes('cardap.io')) failures.push('layout: missing brand');

const productUrls = read('src/lib/landing-product-url.ts');
if (!productUrls.includes('productUrl = (route: string) => route')) failures.push('landing links are not same-origin');
if (!productUrls.includes('`/cadastro?plan=${planId}`')) failures.push('plan links are not same-origin');

for (const relative of [
  'src/app/page.tsx',
  'src/components/landing/BrandLogo.tsx',
  'src/components/landing/Footer.tsx',
  'src/components/landing/Navbar.tsx',
  'src/components/landing/LiveDemoSimulator.tsx',
  'src/components/landing/react-bits/StaggeredMenu.jsx',
]) {
  if (read(relative).includes('Cardapio.io')) failures.push(`${relative}: old brand spelling`);
}

const home = read('src/app/page.tsx');
if (!home.includes('A integração com iFood ainda está em validação.')) failures.push('home: iFood availability unclear');

const image = path.join(frontend, 'public/og-cardapio.png');
if (!fs.existsSync(image)) {
  failures.push('public: missing social image');
} else {
  const png = fs.readFileSync(image);
  if (png.subarray(1, 4).toString() !== 'PNG' || png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) {
    failures.push('public: social image must be 1200 × 630 PNG');
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Integrated domain, brand, links, iFood copy and social image verified.');
}
