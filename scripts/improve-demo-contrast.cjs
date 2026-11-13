const fs = require('node:fs');
const file = 'C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend\\src\\app\\globals.css';
const marker = '/* Interactive demo contrast and reading size */';
const css = `\n${marker}\n.home-theme #simulador .text-muted { color: #43352d !important; }\n.home-theme #simulador .text-xs { font-size: 0.875rem; line-height: 1.45; }\n.home-theme #simulador .text-sm { line-height: 1.55; }\nhtml[data-theme="dark"] .home-theme #simulador .text-muted { color: #e2d8cf !important; }\n`;
const source = fs.readFileSync(file, 'utf8');
if (!source.includes(marker)) fs.writeFileSync(file, source + css);
