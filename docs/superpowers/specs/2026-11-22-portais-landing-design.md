# Portais de afiliados e administração na landing

## Contexto e objetivo

A landing na Vercel deve hospedar todo fluxo que não é a aplicação usada pelo restaurante: candidatura e portal do afiliado, login e painel administrativo da plataforma. Hoje essas páginas estão no frontend do SaaS na Cloudflare. A landing usa exportação estática, enquanto os portais exigem sessão protegida e chamadas à API.

## Critérios de aceite

- `/parceiros`, `/partner/login`, recuperação e portal do afiliado abrem na landing e mostram dados reais da API existente.
- `/admin/login` e `/admin/*` abrem na landing somente para a conta administrativa autenticada com TOTP.
- Nenhuma credencial, token de sessão ou segredo aparece no JavaScript público ou em URLs.
- Sessões de afiliado e admin permanecem separadas; ações administrativas são verificadas pela API, com proteção contra requisições indevidas.
- Textos de cartões carregados depois da página aparecem imediatamente em celular e desktop.
- URLs antigas no SaaS encaminham às novas páginas apenas depois de a landing estar publicada e validada.

## Arquitetura

Substituir `output: 'export'` por execução Next.js na Vercel, mantendo as páginas públicas. Criar rotas de servidor da landing para encaminhar autenticação e dados à API Cloudflare por URL HTTPS configurada no servidor. Preservar cookies HttpOnly, atributos Secure/SameSite e os contratos existentes. Adaptar as páginas e componentes de afiliado/admin do frontend SaaS para a identidade visual da landing, sem duplicar regras financeiras ou de permissão. A API Cloudflare continua sendo a autoridade para dados e ações.

## Falhas e segurança

Falha ou timeout da API deve apresentar erro legível, sem liberar painel. Logout revoga sessão. Não aceitar origem arbitrária para o proxy, nem usar credenciais de produção em homologação. Evitar cache de respostas privadas e indexação dos painéis. O deploy da landing não altera o Worker de cobrança.

## Execução e testes

1. Criar testes para URLs, proxy, cookies, acesso sem sessão e conteúdo assíncrono visível.
2. Implementar configuração Vercel e proxy protegido por rotas explícitas.
3. Migrar telas e componentes, ajustar links, navegação e estilos.
4. Rodar tipos, testes, build e verificação visual local para visitante, afiliado e admin.
5. Publicar preview Vercel, testar autenticação real na homologação e só então mudar URLs antigas.
