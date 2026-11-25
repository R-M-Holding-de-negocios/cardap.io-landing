# Correções implementadas — 14/11/2026

| Alteração | Problema / gravidade | Arquivos | Validação | Risco residual |
|---|---|---|---|---|
| Remoção de ferramentas de deploy não usadas e atualização transitiva | Dependências com avisos conhecidos / **alta** | `package.json`, `package-lock.json` | `npm audit`: 0; `npm run build`: exportação completa | O ambiente de publicação real não foi identificado. |
| Bloqueio de destino local em build público configurado | Encaminhamento de usuários para localhost / **média** | `src/lib/product-url.ts`, `test/product-url.test.ts` | Teste de configuração pública e prévia local | É necessário configurar `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_SAAS_URL` corretamente no deploy. |
| Preferências locais versionadas | Transparência e revogação / **média** | `src/lib/consent.ts`, `CookieConsent.tsx`, `CookiePreferencesButton.tsx` | 3 testes unitários e 3 testes de navegador | Não há scripts opcionais hoje; qualquer integração futura precisa consultar a preferência antes do primeiro carregamento e descarregar/reinicializar ao revogar. |
| Documentos e navegação legal | Ausência de transparência / **média** | `src/app/{termos-de-uso,politica-de-privacidade,politica-de-cookies}/page.tsx`, `Footer.tsx`, `LegalPage.tsx` | Build estático e testes de navegação | Placeholders e termos do SaaS exigem confirmação do proprietário e revisão jurídica. |

## Operação segura pendente

O export estático não emite cabeçalhos por conta própria. No host final, configurar HTTPS/TLS, redirecionamento de HTTP, HSTS somente após validar HTTPS em todo o domínio, CSP compatível com os scripts inline gerados pelo Next, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` e `Permissions-Policy` restritiva. Validar os cabeçalhos por resposta HTTP publicada. Não copiar uma CSP pronta para o SaaS integrado sem inventariar suas APIs e terceiros.

O código desta landing não fornece sessão, autenticação, endpoints ou banco. Controles desses serviços, privilégios mínimos, rotação de credenciais, rate limit, logs, backup e recuperação precisam ser verificados no projeto e provedor correspondentes. O arquivo `.env.example` não contém segredo; não foi encontrado segredo em arquivos versionados inspecionados. Não foi realizada inspeção de credenciais reais fora do repositório.
