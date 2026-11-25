# Diagnóstico inicial — 14/11/2026

## Escopo e arquitetura observados

Este repositório contém a **landing isolada** do cardap.io, em Next.js 16.4.3, React 19, TypeScript, Tailwind e exportação estática (`next.config.mjs`). O `README.md` aponta o sistema principal para `C:\CARDAPIO-ANFC\Anfc-Cardapios`, fora deste workspace autorizado para escrita. Uma inspeção complementar **somente de leitura** confirmou frontend Next.js, Worker Cloudflare/Hono, banco D1, armazenamento R2 e Durable Objects; `backend/` em Go é legado/alternativo segundo o `AGENTS.md` daquele projeto. Isso não constitui auditoria integral de sua API ou banco. Os scripts de build desta pasta apenas geram `out/`; DNS, TLS e hospedagem pública não foram verificados aqui.

Rotas locais: `/` (apresentação, prévia interativa e planos), `/login` e `/cadastro` (páginas de passagem). A navegação para login, cadastro, parceiros, suporte e recursos usa `NEXT_PUBLIC_SAAS_URL` via `src/lib/product-url.ts`. A página anuncia cadastro, planos e pagamento no sistema principal; não há processamento de pagamento nesta landing. Não foram encontrados `app/api`, servidor, banco, formulários de envio, upload ou controle de acesso local. O único perfil local é visitante público; perfis de restaurante, equipe e parceiros são anunciados mas residem no sistema principal.

## Dados e tecnologias

| Fluxo | Dados observados nesta origem | Destino / observação |
|---|---|---|
| Visita e navegação | Requisições de arquivos; IP e logs podem existir no provedor | Provedor de hospedagem não identificado; retenção desconhecida |
| Tema | `cardapio-theme` em `localStorage` | Só navegador; sem identificador pessoal no código |
| Prévia do sistema | Entradas simuladas na interface | Sem `fetch` ou envio ao servidor observado |
| Planos/cadastro/login | Parâmetro `plan` e clique no link | Redirecionamento ao sistema principal; dados posteriores fora do escopo |

Não há `document.cookie`, scripts remotos de analytics, pixels, tags de publicidade, `fetch`, `dangerouslySetInnerHTML` ou formulários que enviem dados em `src/` na revisão inicial. Não se pode inferir a ausência de cookies do CDN, provedor ou sistema principal.

## Segurança inicial e limites

- **Alta — dependências:** `npm audit` identificou 6 registros altos e 4 moderados, principalmente em `@opennextjs/cloudflare`/`wrangler`, que não são usados pelo build estático. Ver `vulnerabilities.md` para tratamento e rechecagem.
- **Média — navegação:** o build isolado usa `http://localhost:3000` quando `NEXT_PUBLIC_SAAS_URL` não está configurada. Publicar `out/` assim envia visitantes ao localhost deles. O README já adverte que esta saída é apenas prévia.
- **Média — cabeçalhos:** exportação estática não configura CSP, HSTS e demais cabeçalhos no código; depende do host. Sem identificação da plataforma, não é possível confirmar os cabeçalhos publicados.
- **Média — transparência:** faltam documentos legais, identidade do controlador, canal de privacidade, retenção, terceiros e informações contratuais confirmadas.
- **Baixa — preferência local:** o tema é persistido sem aviso de armazenamento local. Não há rastreador opcional a bloquear hoje.

Autenticação, autorização, CSRF, SQLi, SSRF, IDOR, upload, rate limiting, sessões, recuperação de senha, banco, backups e logs do SaaS **não são verificáveis neste repositório**. Não há endpoint correspondente aqui; a leitura pontual externa abaixo não é uma auditoria integral desses controles. Esta conclusão é um limite de escopo, não um atestado de segurança do sistema principal.

Na leitura complementar do SaaS, `worker/src/auth.ts` mostra cookies de sessão HttpOnly, SameSite=Lax, Secure em produção, token aleatório com hash no D1, consulta de sessão e limites de tentativas. `worker/src/index.ts` contém checagem de origem e algumas fronteiras de papel/estabelecimento. Esses trechos são evidência de controles implementados, não de cobertura completa nem de funcionamento no deploy. O cadastro real coleta nome do restaurante, nome do responsável, e-mail, telefone, senha, plano e forma de pagamento; `worker/src/auth.ts` grava os dados em D1 e inicia a cobrança. O fluxo de parceiros coleta nome, e-mail, chave Pix e outros campos. Dados de mesas, pedidos e equipe estão no Worker/D1 e exigem inventário próprio. Dois achados específicos da leitura constam em `vulnerabilities.md`.

## Método

Inventário de arquivos e buscas de fontes e sumidouros em `src/`, revisão de configuração, rotas e dependências, `npm ls` e `npm audit` em 14/11/2026. Referências técnicas: OWASP Top 10 e ASVS. Nenhum teste destrutivo ou em produção foi realizado.
