const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../out');
const types = { '.html': 'text/html', '.txt': 'text/plain', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };

http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end(); return; }
  const candidate = pathname === '/' ? '/index.html' : pathname;
  const file = path.resolve(root, `.${candidate}`);
  if (!file.startsWith(`${root}${path.sep}`)) { response.writeHead(403).end(); return; }
  const target = fs.existsSync(file) && fs.statSync(file).isFile() ? file : `${file}.html`;
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) { response.writeHead(404).end(); return; }
  response.setHeader('Content-Type', `${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8`);
  fs.createReadStream(target).pipe(response);
}).listen(3001, 'localhost');
