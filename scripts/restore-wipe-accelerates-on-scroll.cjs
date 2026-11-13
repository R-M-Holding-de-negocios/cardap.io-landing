const fs = require('node:fs');
const path = require('node:path');
const root = 'C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend';
const providerFile = path.join(root, 'src/components/AppThemeProvider.tsx');
const cssFile = path.join(root, 'src/app/globals.css');
let provider = fs.readFileSync(providerFile, 'utf8');
const old = `    document.querySelectorAll<HTMLElement>('[style*="--app-theme-delay"]').forEach(element => element.style.removeProperty('--app-theme-delay'));
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
    }, 820);`;
const replacement = `    if (document.startViewTransition) {
      root.classList.add('landing-organic-theme-transition');
      const transition = document.startViewTransition(change);
      let scrollTimer: number | null = null;
      const cleanup = () => {
        root.classList.remove('landing-organic-theme-transition', 'theme-reveal-accelerating');
        window.removeEventListener('scroll', accelerateOnScroll);
        if (scrollTimer !== null) window.clearTimeout(scrollTimer);
        if (cleanupRef.current !== null) window.clearTimeout(cleanupRef.current);
        cleanupRef.current = null;
      };
      const accelerateOnScroll = () => {
        root.classList.add('theme-reveal-accelerating');
        scrollTimer = window.setTimeout(() => transition.skipTransition(), 260);
      };
      window.addEventListener('scroll', accelerateOnScroll, { passive: true, once: true });
      cleanupRef.current = window.setTimeout(() => transition.skipTransition(), 1000);
      void transition.finished.then(cleanup, cleanup);
      return;
    }
    change();`;
if (!provider.includes(old)) throw new Error('Theme sweep block changed; inspect before replacing');
fs.writeFileSync(providerFile, provider.replace(old, replacement));

let css = fs.readFileSync(cssFile, 'utf8');
const marker = '/* Scrolling speeds the organic reveal to completion instead of cutting it off. */';
if (!css.includes(marker)) css += `\n${marker}\nhtml.theme-reveal-accelerating.landing-organic-theme-transition::view-transition-new(root) { animation-duration: 180ms !important; }\n`;
fs.writeFileSync(cssFile, css);
