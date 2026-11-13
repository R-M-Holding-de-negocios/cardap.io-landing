const fs = require('node:fs');
const path = require('node:path');
const file = path.join('C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend', 'src/components/AppThemeProvider.tsx');
let source = fs.readFileSync(file, 'utf8');
const start = `    if (document.startViewTransition) {`;
const end = `    }, 820);`;
const a = source.indexOf(start);
const endIndex = source.indexOf(end, a);
const b = endIndex < 0 ? -1 : endIndex + end.length;
if (a < 0 || b < 0) throw new Error('Organic transition block changed; inspect before replacing');
const replacement = `    document.querySelectorAll<HTMLElement>('[style*="--app-theme-delay"]').forEach(element => element.style.removeProperty('--app-theme-delay'));
    const viewportHeight = window.innerHeight || 1;
    const elements = Array.from(document.body.querySelectorAll<HTMLElement>('*'));
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const center = Math.max(0, Math.min(viewportHeight, rect.top + rect.height / 2));
      element.style.setProperty('--app-theme-delay', String(Math.round((center / viewportHeight) * 560)) + 'ms');
    });
    root.classList.add('app-theme-sweeping');
    change();
    cleanupRef.current = window.setTimeout(() => {
      root.classList.remove('app-theme-sweeping');
      elements.forEach(element => element.style.removeProperty('--app-theme-delay'));
    }, 820);
`;
source = source.slice(0, a) + replacement + source.slice(b);
fs.writeFileSync(file, source);
