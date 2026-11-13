const fs = require('node:fs');
const path = require('node:path');
const publicDir = path.resolve('C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend\\src\\components\\public');
const names = ['LandingBackgroundScenery.tsx', 'LandingThemeProvider.tsx', 'LiveDemoSimulator.tsx', 'ProductPreview.tsx', 'react-bits'];
for (const name of names) {
  const target = path.resolve(publicDir, name);
  if (!target.startsWith(publicDir + path.sep)) throw new Error(`Unsafe target: ${target}`);
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: false });
}
console.log('Removed duplicate components created by the first copy.');
