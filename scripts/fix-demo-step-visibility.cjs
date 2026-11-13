const fs = require('node:fs');
const file = 'C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend\\src\\app\\globals.css';
const marker = '/* Dynamic demo steps must stay visible after the initial page reveal. */';
const css = `\n${marker}\n.home-theme.home-text-entrances-ready main #simulador :is(h1,h2,h3,h4,p,li) { opacity: 1; transform: none; animation: none; }\n`;
const source = fs.readFileSync(file, 'utf8');
if (!source.includes(marker)) fs.writeFileSync(file, source + css);
