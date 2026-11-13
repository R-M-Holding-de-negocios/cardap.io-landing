const fs = require('node:fs');
const path = require('node:path');

const landing = 'C:\\CARDAPIO-LANDING';
const product = 'C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend';
if (!fs.existsSync(path.join(product, 'src/app/login/page.tsx'))) throw new Error('Unexpected product directory');

function read(relative, root = product) { return fs.readFileSync(path.join(root, relative), 'utf8'); }
function write(relative, content) {
  const target = path.join(product, relative);
  if (!target.startsWith(product + path.sep)) throw new Error('Target outside product project');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}
function copy(relativeSource, relativeTarget) {
  const target = path.join(product, relativeTarget);
  if (!target.startsWith(product + path.sep)) throw new Error('Target outside product project');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(landing, relativeSource), target);
}
function files(dir) {
  return fs.readdirSync(path.join(landing, dir), { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}

for (const source of files('src/components/public')) {
  const target = path.join('src/components/landing', path.relative('src/components/public', source));
  const content = read(source, landing).replaceAll('@/components/public/', '@/components/landing/').replaceAll('@/lib/product-url', '@/lib/landing-product-url');
  write(target, content);
}
for (const source of files('public/images/landing')) copy(source, source);
for (const name of ['logo-cardapio-dark.png', 'logo-cardapio-light.png', 'logo-cardapio.png', 'logo-marca.png']) {
  if (!fs.existsSync(path.join(product, 'public', name))) copy(`public/${name}`, `public/${name}`);
}
for (const name of ['landing-assets.ts', 'landing-theme.ts', 'parallax.ts']) copy(`src/lib/${name}`, `src/lib/${name}`);

write('src/lib/landing-product-url.ts', `export type PlanId = 'basic' | 'essential' | 'pro';\nexport const productUrl = (route: string) => route;\nexport const planSignupUrl = (planId: PlanId) => \`/cadastro?plan=\${planId}\`;\n`);
write('src/app/page.tsx', read('src/app/page.tsx', landing).replaceAll('@/components/public/', '@/components/landing/').replaceAll('@/lib/product-url', '@/lib/landing-product-url'));

const landingCss = read('src/app/globals.css', landing).split(/\r?\n/);
const sections = [[92,183],[207,213],[260,262],[268,299],[430,463]];
const scopedCss = sections.map(([start,end]) => landingCss.slice(start-1,end).join('\n')).join('\n');
let productCss = read('src/app/globals.css');
if (!productCss.includes('/* Unified local landing styles */')) productCss += `\n/* Unified local landing styles */\n${scopedCss}\n`;
write('src/app/globals.css', productCss);

for (const relative of [
  'src/app/waiter/page.tsx', 'src/app/dashboard/DashboardShell.tsx',
  'src/app/partner/login/page.tsx', 'src/app/parceiros/page.tsx',
]) {
  let content = read(relative);
  content = content.replaceAll('https://www.cardap.io/', '/').replaceAll('https://cardap.io/r/', 'http://localhost:3000/r/');
  write(relative, content);
}
const applyRoute = 'src/app/api/partners/apply/route.ts';
write(applyRoute, read(applyRoute).replace('`https://cardap.io/r/${partnerCode}`', '`${req.nextUrl.origin}/r/${partnerCode}`'));
console.log('Landing moved to product home and public navigation made local.');
