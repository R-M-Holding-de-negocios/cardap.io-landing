const fs = require('node:fs');
const file = 'C:\\CARDAPIO-ANFC\\Anfc-Cardapios\\frontend\\src\\components\\account\\SupportPanel.tsx';
const source = fs.readFileSync(file, 'utf8');
const oldLinks = '<a href={`mailto:${data.support.email}`}><Mail size={22}/><span><strong>Falar por e-mail</strong><small>{data.support.email}</small></span></a>{data.support.whatsapp&&<a href={`https://wa.me/${data.support.whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={22}/><span><strong>Falar no WhatsApp</strong><small>Abrir conversa com nossa equipe</small></span></a>}';
const localContent = '<span><Mail size={22}/><span><strong>E-mail de suporte</strong><small>{data.support.email}</small></span></span>{data.support.whatsapp&&<span><MessageCircle size={22}/><span><strong>WhatsApp de suporte</strong><small>{data.support.whatsapp}</small></span></span>}';
if (!source.includes(oldLinks)) throw new Error('Support links changed; inspect before editing');
fs.writeFileSync(file, source.replace(oldLinks, localContent));
