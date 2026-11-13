const fs = require('node:fs');
const path = require('node:path');
const root = 'C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend';
const providerFile = path.join(root, 'src/components/AppThemeProvider.tsx');
const cssFile = path.join(root, 'src/app/globals.css');
let provider = fs.readFileSync(providerFile, 'utf8');
const old = `    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { change(); return; }
    if (document.startViewTransition) {
      root.classList.add('landing-organic-theme-transition');
      const transition = document.startViewTransition(change);
      const cleanup = () => root.classList.remove('landing-organic-theme-transition');
      void transition.finished.then(cleanup, cleanup);
      return;
    }
    change();
    root.classList.add('app-theme-sweeping');
    cleanupRef.current = window.setTimeout(() => root.classList.remove('app-theme-sweeping'), THEME_SWEEP_MS + 220);`;
const replacement = `    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (cleanupRef.current !== null) window.clearTimeout(cleanupRef.current);
    root.classList.remove('app-theme-color-transition');
    change();
    if (reduceMotion) return;
    root.classList.add('app-theme-color-transition');
    cleanupRef.current = window.setTimeout(() => root.classList.remove('app-theme-color-transition'), 220);`;
if (!provider.includes(old)) throw new Error('Theme transition implementation changed; inspect before replacing');
provider = provider.replace(old, replacement);
provider = provider.replace('document.documentElement.classList.remove(\'landing-organic-theme-transition\', \'app-theme-sweeping\');', 'document.documentElement.classList.remove(\'landing-organic-theme-transition\', \'app-theme-sweeping\', \'app-theme-color-transition\');');
fs.writeFileSync(providerFile, provider);

let css = fs.readFileSync(cssFile, 'utf8');
const marker = '/* Theme changes fade colors without taking a viewport snapshot. */';
if (!css.includes(marker)) css += `\n${marker}\n.app-theme-color-transition, .app-theme-color-transition * { transition-property: color, background-color, border-color, fill, stroke !important; transition-duration: 180ms !important; transition-timing-function: ease; }\n`;
fs.writeFileSync(cssFile, css);
