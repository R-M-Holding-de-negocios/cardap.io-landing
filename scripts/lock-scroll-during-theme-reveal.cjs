const fs = require('node:fs');
const path = require('node:path');
const file = path.join('C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend', 'src/components/AppThemeProvider.tsx');
let source = fs.readFileSync(file, 'utf8');
const old = `      let scrollTimer: number | null = null;
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
      void transition.finished.then(cleanup, cleanup);`;
const replacement = `      const previousHtmlOverflow = root.style.overflow;
      const previousBodyOverflow = document.body.style.overflow;
      root.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      const cleanup = () => {
        root.classList.remove('landing-organic-theme-transition');
        root.style.overflow = previousHtmlOverflow;
        document.body.style.overflow = previousBodyOverflow;
        if (cleanupRef.current !== null) window.clearTimeout(cleanupRef.current);
        cleanupRef.current = null;
      };
      cleanupRef.current = window.setTimeout(() => transition.skipTransition(), 950);
      void transition.finished.then(cleanup, cleanup);`;
if (!source.includes(old)) throw new Error('Theme reveal scroll handling changed; inspect before replacing');
fs.writeFileSync(file, source.replace(old, replacement));
