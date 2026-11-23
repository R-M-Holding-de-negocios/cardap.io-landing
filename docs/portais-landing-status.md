# Portais na landing — estado em 23/11/2026

## Implementado localmente

- Páginas `/parceiros`, `/partner/login`, `/partner/reset` e `/admin/*` trazidas do frontend do SaaS para esta landing.
- Next.js preparado para rotas de servidor na Vercel, substituindo a exportação estática.
- Proxy de rotas explícitas para a API Cloudflare, com cookies HttpOnly encaminhados apenas à área correspondente, respostas privadas sem cache e bloqueio de POST de origem divergente.
- Verificação de sessão administrativa no servidor antes de renderizar `/admin/*`; TOTP e autorização de ações continuam na API Cloudflare.
- Link `/r/[code]` registra visita quando a API responde e leva ao cadastro na landing com o código preenchido.
- Cadastro do restaurante também passa pelo servidor da landing em `/api/auth/register`, sem depender de CORS do navegador.
- Navegação pública aponta para o programa e portal na própria landing. Texto da simulação usa o preço Pro atual de R$ 149.

## Evidência

- `npm run typecheck`: aprovado novamente em 23/11.
- `npm test -- --run`: 39/39 aprovados novamente em 23/11.
- `npm run build`: não concluiu neste ambiente; Windows sandbox retornou `EPERM` ao criar pastas de `.next`, inclusive com diretório de build alternativo. O build remoto da Vercel concluiu e o Preview ficou `READY` em 22/11/2026. O teste visual autenticado segue pendente.
- `git diff --check`: sem erro de espaço.

## Pendente antes de publicar

1. **Feito em Preview Vercel:** `PLATFORM_API_URL` aponta para a API HTTPS de homologação e `NEXT_PUBLIC_SAAS_URL` aponta para o aplicativo de homologação. Nenhuma variável de produção foi alterada. `NEXT_PUBLIC_API_URL` deixou de ser necessário; `NEXT_PUBLIC_SITE_URL` é opcional para metadados e pode ficar ausente no Preview.
2. **Concluído em Preview:** branch `codex/portais-landing-preview`, correção visual no commit `f711011`; build remoto aprovado, deploy `dpl_EEbNkoV3AsZsCPUeDqLxC4cmi8wf` pronto em `https://cardap-io-landing-mv8v2e2sd-rj-6821.vercel.app`. O deploy usa a branch separada e não alterou a produção. O Preview está protegido por autenticação Vercel.
3. **Validado em 23/11:** login TOTP do admin e login do afiliado, com participação do proprietário; visão geral, restaurantes, afiliados, repasses, atendimento e auditoria abriram com dados reais no Preview. Cartões e textos carregados ficaram legíveis no celular; a visão geral administrativa também foi conferida em desktop. O link de indicação levou ao cadastro com o código preenchido e o contador de acessos do afiliado passou de 2 para 3. O tema da landing foi corrigido para manter logo, menu e conteúdo sincronizados; a correção foi verificada nos temas claro e escuro no Preview `https://cardap-io-landing-mv8v2e2sd-rj-6821.vercel.app`. Ainda faltam envio real da candidatura, recuperação de acesso, cadastro completo de restaurantes, logout e o ciclo de comissão/repasses no Asaas sandbox.
4. Só após validação, decidir destino da API de produção e publicar no domínio principal. Não apontar produção para a API de homologação.
5. Após a landing estar operando, atualizar as rotas antigas do frontend SaaS para encaminhar usuários à landing; ainda não alteradas.

Os painéis estão no **Preview protegido** da Vercel. As páginas `/parceiros`, `/partner/login`, `/admin/login` e `/cadastro` responderam 200; `/admin` sem sessão exibiu o login, e a API administrativa sem sessão respondeu 401. A API Cloudflare, o SaaS dos restaurantes e o domínio de produção permanecem inalterados nesta etapa.
