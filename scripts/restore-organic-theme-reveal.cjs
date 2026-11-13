const fs = require('node:fs');
const path = require('node:path');
const file = path.join('C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend', 'src/components/AppThemeProvider.tsx');
let source = fs.readFileSync(file, 'utf8');
const old = `    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (cleanupRef.current !== null) window.clearTimeout(cleanupRef.current);
    root.classList.remove('app-theme-color-transition');
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
const replacement = `    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (cleanupRef.current !== null) window.clearTimeout(cleanupRef.current);
    root.classList.remove('app-theme-color-transition', 'app-theme-sweeping', 'landing-organic-theme-transition');
    if (reduceMotion) { change(); return; }
    if (document.startViewTransition) {
      root.classList.add('landing-organic-theme-transition');
      const transition = document.startViewTransition(change);
      const finish = () => {
        root.classList.remove('landing-organic-theme-transition');
        window.removeEventListener('scroll', cancelOnScroll);
        if (cleanupRef.current !== null) window.clearTimeout(cleanupRef.current);
        cleanupRef.current = null;
      };
      const cancelOnScroll = () => {
        transition.skipTransition();
        finish();
      };
      window.addEventListener('scroll', cancelOnScroll, { passive: true, once: true });
      cleanupRef.current = window.setTimeout(finish, 900);
      void transition.finished.then(finish, finish);
      return;
    }
    const viewportHeight = window.innerHeight || 1;
    const elements = Array.from(document.body.querySelectorAll<HTMLElement>('*'));
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= viewportHeight) return;
      const center = Math.max(0, Math.min(viewportHeight, rect.top + rect.height / 2));
      element.style.setProperty('--app-theme-delay', String(Math.round((center / viewportHeight) * 560)) + 'ms');
    });
    root.classList.add('app-theme-sweeping');
    change();
    cleanupRef.current = window.setTimeout(() => {
      root.classList.remove('app-theme-sweeping');
      elements.forEach(element => element.style.removeProperty('--app-theme-delay'));
    }, 820);`;
if (!source.includes(old)) throw new Error('Current theme transition changed; inspect before replacing');
source = source.replace(old, replacement);
fs.writeFileSync(file, source);
