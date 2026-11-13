const fs = require('node:fs');
const path = require('node:path');
const root = 'C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend';
const providerFile = path.join(root, 'src/components/AppThemeProvider.tsx');
const cssFile = path.join(root, 'src/app/globals.css');
let provider = fs.readFileSync(providerFile, 'utf8');
const old = `    root.classList.remove('app-theme-color-transition');
    change();
    if (reduceMotion) return;
    root.classList.add('app-theme-color-transition');
    cleanupRef.current = window.setTimeout(() => root.classList.remove('app-theme-color-transition'), 220);`;
const replacement = `    root.classList.remove('app-theme-color-transition');
    if (reduceMotion) { change(); return; }
    document.querySelectorAll<HTMLElement>('[style*="--app-theme-delay"]').forEach(element => element.style.removeProperty('--app-theme-delay'));
    const viewportHeight = window.innerHeight || 1;
    const elements = Array.from(document.body.querySelectorAll<HTMLElement>('*'));
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= viewportHeight) return;
      const center = Math.max(0, Math.min(viewportHeight, rect.top + rect.height / 2));
      const delay = Math.round((center / viewportHeight) * 560);
      element.style.setProperty('--app-theme-delay', String(delay) + 'ms');
    });
    root.classList.add('app-theme-sweeping');
    change();
    cleanupRef.current = window.setTimeout(() => {
      root.classList.remove('app-theme-sweeping');
      elements.forEach(element => element.style.removeProperty('--app-theme-delay'));
    }, 820);`;
if (!provider.includes(old)) throw new Error('Theme transition implementation changed; inspect before replacing');
fs.writeFileSync(providerFile, provider.replace(old, replacement));

let css = fs.readFileSync(cssFile, 'utf8');
const marker = '/* The theme sweep animates live elements while allowing normal scrolling. */';
if (!css.includes(marker)) css += `\n${marker}\n.app-theme-sweeping, .app-theme-sweeping * { transition-delay: var(--app-theme-delay, 0ms) !important; }\n`;
fs.writeFileSync(cssFile, css);
