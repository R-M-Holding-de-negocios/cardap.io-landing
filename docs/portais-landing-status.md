# Portais na landing — estado em 22/11/2026

## Implementado localmente

- Páginas `/parceiros`, `/partner/login`, `/partner/reset` e `/admin/*` trazidas do frontend do SaaS para esta landing.
- Next.js preparado para rotas de servidor na Vercel, substituindo a exportação estática.
- Proxy de rotas explícitas para a API Cloudflare, com cookies HttpOnly encaminhados apenas à área correspondente, respostas privadas sem cache e bloqueio de POST de origem divergente.
- Verificação de sessão administrativa no servidor antes de renderizar `/admin/*`; TOTP e autorização de ações continuam na API Cloudflare.
- Link `/r/[code]` registra visita quando a API responde e leva ao cadastro na landing com o código preenchido.
- Cadastro do restaurante também passa pelo servidor da landing em `/api/auth/register`, sem depender de CORS do navegador.
- Navegação pública aponta para o programa e portal na própria landing. Texto da simulação usa o preço Pro atual de R$ 149.

## Evidência

- `npm run typecheck`: aprovado.
- `npm test -- --run`: 39/39 aprovados após a migração do cadastro para o servidor.
- `npm run build`: não concluiu neste ambiente; Windows sandbox retornou `EPERM` ao criar pastas de `.next`, inclusive com diretório de build alternativo. Não há prova de build Vercel ou teste visual autenticado.
- `git diff --check`: sem erro de espaço.

## Pendente antes de publicar

1. **Feito em Preview Vercel:** `PLATFORM_API_URL` aponta para a API HTTPS de homologação e `NEXT_PUBLIC_SAAS_URL` aponta para o aplicativo de homologação. Nenhuma variável de produção foi alterada. `NEXT_PUBLIC_API_URL` deixou de ser necessário; `NEXT_PUBLIC_SITE_URL` é opcional para metadados e pode ficar ausente no Preview.
2. Fazer build em ambiente autorizado fora do sandbox Windows e publicar Preview Vercel. Os 113 arquivos necessários foram enviados à Vercel, sem segredos ou arquivos internos, mas nenhum deploy foi criado. A API de criação rejeitou `target: "preview"`; uma tentativa sem alvo explícito foi barrada pela revisão automática porque poderia publicar em produção. A documentação oficial apresenta `staging` como ambiente personalizado, e este projeto não possui ambientes personalizados. Não usar `staging` sem garantia de que ele representa Preview. O projeto está conectado ao GitHub `R-M-Holding-de-negocios/cardap.io-landing`, mas as mudanças locais ainda não foram enviadas a ele.
3. Verificar login TOTP do admin, login/recuperação do afiliado, candidatura, indicação, cadastro, logout e todas as páginas administrativas no Preview. Testar cartões em celular e desktop. A tentativa de acessar o servidor local por HTTP também foi bloqueada pelas permissões de rede deste ambiente.
4. Só após validação, decidir destino da API de produção e publicar no domínio principal. Não apontar produção para a API de homologação.
5. Após a landing estar operando, atualizar as rotas antigas do frontend SaaS para encaminhar usuários à landing; ainda não alteradas.

Os painéis **não estão publicados** na Vercel. A API Cloudflare e o SaaS dos restaurantes permanecem inalterados nesta etapa.
