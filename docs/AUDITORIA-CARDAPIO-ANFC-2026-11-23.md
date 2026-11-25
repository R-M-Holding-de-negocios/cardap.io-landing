# Auditoria técnica de `C:\CARDAPIO-ANFC\Anfc-Cardapios`

**Data:** 23/11/2026  
**Método:** leitura de código, manifests, migrations, testes e documentos. Nenhum arquivo do projeto auditado foi alterado; nenhuma migration, escrita remota ou teste contra produção foi executado.  
**Stack ativa:** frontend Next.js/OpenNext, API Cloudflare Workers/Hono, D1, R2 e Durable Objects. `backend/` em Go é legado/alternativo. O projeto não usa PostgreSQL, Supabase ou Redis na rota principal (`AGENTS.md`).

## Cinco achados prioritários

| Prioridade | Achado e evidência | Impacto / ação sugerida |
| --- | --- | --- |
| **Alta** | A cópia principal do Worker faz chamadas Asaas sem `User-Agent` (`worker/src/billing.ts:24-31`), e cadastro/cliente não recebem CPF/CNPJ (`worker/src/auth.ts:68-94`, `worker/src/billing.ts:139-143`, `frontend/src/app/cadastro/page.tsx:18-30`). Na homologação, o Asaas respondeu `user_agent_not_informed` e recusou a assinatura sem documento; a cópia de trabalho corrigida foi publicada somente no Worker de homologação. | Um novo deploy da fonte principal pode reintroduzir falha na cobrança. Sincronizar as correções já testadas, versionar, testar cadastro novo e publicar primeiro em homologação. |
| **Alta** | Criação de cliente, assinatura e cobrança no gateway é seguida de gravação do ID no D1 (`worker/src/billing.ts:139-175`), sem chave de idempotência nem reconciliação por referência antes de repetir a chamada. | Queda entre a resposta do Asaas e `persistProgress()` pode criar recursos duplicados em nova tentativa. Antes de cada repetição, consultar o gateway pela referência persistente e usar idempotência quando o endpoint oferecer suporte. Cobrir com teste de falha nesse intervalo. |
| **Alta** | Não foi encontrada evidência atual de restauração de backup em banco separado. O handoff registra exportação pontual antes de migrations (`docs/AI-PROJECT-HANDOFF.md:62`), e o roadmap deixa restore como validação futura. | Exportação sem ensaio não comprova recuperação. Definir retenção, cópia fora do provedor, restauração em banco descartável e comparação de esquema/contagens. Confirmar qual banco usa o subsistema D1 com Time Travel. |
| **Média** | Listagens administrativas usam `instr(lower(...))`, extração JSON e `LIMIT ... OFFSET` (`worker/src/platform-admin/affiliates.ts:15`, `support.ts:14`, `restaurants.ts:9,30`). | Busca pode varrer muitas linhas; páginas profundas repetem trabalho. Medir `rows_read` e plano de consulta com dados representativos, depois considerar índice/projeção e cursor onde houver ganho real. |
| **Média** | A fonte principal e a homologação divergem; o relatório antigo `AUDITORIA.md` (11/10) descreve autenticação em memória, enquanto a rota atual usa D1, hash e cookie HttpOnly (`worker/src/auth.ts:22-48`). | Auditorias e próximos deploys podem se basear em conclusões incorretas. Consolidar a fonte publicada, identificar versão e atualizar documentos operacionais antes do lançamento. |

## Banco de dados e integridade

| Tema | Estado observado | Limite / próximo passo |
| --- | --- | --- |
| Modelagem | Há 36 arquivos SQL de migration. D1/SQLite guarda registros relacionais e parte dos atributos em JSON. Valores financeiros de cobrança/comissão/repasse usam `INTEGER` em centavos, com checks e índices únicos (`migrations/0024_saas_billing.sql`, `0025_affiliates.sql`, `0028_affiliate_admin.sql`). | Não foi executado inventário de **todas** as colunas e constraints nem contagem remota de linhas que infringiriam novas regras. Campos dentro do JSON exigem validação no servidor ou checks específicos; `CHECK(json_valid(data))` não valida estrutura ou domínio dos atributos. |
| Transações | Cadastro usa `DB.batch` (`worker/src/auth.ts:92`); processamento de webhook também agrupa mudança de contrato, conta, comissão e evento (`worker/src/billing.ts:214-242`). A aprovação de repasses possui triggers de saldo e mínimo de dois restaurantes (`migrations/0028_affiliate_admin.sql`, `0035_affiliate_payout_minimum.sql`). | Não foi feito inventário completo de operações com várias escritas nem teste de falha intermediária para cada uma. Chamadas ao Asaas permanecem corretamente fora da transação D1, mas precisam de reconciliação. |
| Migrations | Há configs Wrangler separadas para API principal e `gestao-homologacao`, com bancos D1 diferentes. O comando de migrations está no `worker/package.json`. | A comparação entre esquema gerado e esquema **real** dos bancos não foi repetida nesta auditoria. Existem dois arquivos com prefixo `0024`; Wrangler usa arquivos, mas a numeração duplicada prejudica revisão humana. Não foi verificada a configuração de produção remota. |
| Backups | [Time Travel do D1](https://developers.cloudflare.com/d1/reference/time-travel/) oferece recuperação por ponto no tempo conforme plano/subsistema. Documentos internos citam exportações pontuais. | Não foi comprovado backup externo periódico nem restauração em banco separado. A operação `time-travel restore` sobrescreve o banco alvo; jamais ensaiá-la no banco em serviço. |
| Custos | [D1 cobra por linhas lidas/escritas e armazenamento](https://developers.cloudflare.com/d1/platform/pricing/). As consultas administrativas citadas podem elevar leituras; há tempo real e cron por minuto (`worker/wrangler.jsonc`). | Sem métricas atuais de `rows_read`, usuários ativos, plano contratado e tráfego, não há estimativa responsável para 10× usuários. Medir no dashboard/API Analytics e definir alertas mais limites de produto. No plano pago, o orçamento não é um teto automático de consultas. |

## Código, segurança e pagamentos

| Tema | Estado observado | Limite / próximo passo |
| --- | --- | --- |
| Banco exposto | D1 é acessado pelo binding do Worker, não por uma porta PostgreSQL pública. O frontend fala com a API; não foi localizada conexão direta do navegador ao D1. | Não foram examinadas permissões reais da conta Cloudflare, rotas/deploys remotos ou histórico Git; portanto exposição real e segredos publicados anteriormente permanecem **não verificados**. `.gitignore:126-127` ignora `.dev.vars*`, o que não prova que nunca foi commitado. |
| Autorização | Sessões são consultadas por hash/expiração e papel/estabelecimento (`worker/src/auth.ts:22-48`). A API tem verificações de origem, papel e tenant (`worker/src/index.ts:60-67,133-134`). Admin da plataforma tem identidade separada. | Isso comprova controles no código, não cobertura de todas as rotas. Fazer matriz de quem pode ler/gravar cada recurso e testar tentativas entre restaurantes. RLS/GRANT de Supabase não se aplica ao D1. |
| Webhook Asaas | Token do webhook é comparado antes de ler/processar o corpo; o Worker consulta o objeto atual no Asaas e registra ID único de evento (`worker/src/billing.ts:331-347`, `migrations/0024_saas_billing.sql:27-34`). Há teste de duplicação em `worker/test/billing.test.ts`. | O esquema não prova resistência de todos os webhooks a duas requisições **simultâneas**. Revisar o teste concorrente e falhas entre criação no Asaas e persistência local. Asaas usa token de autenticação do webhook, não assinatura HMAC do corpo; não exigir mecanismo que o provedor não fornece. |
| Corridas | Triggers e `UPDATE ... WHERE status=... RETURNING` protegem várias decisões administrativas. `affiliate_commissions` tem `UNIQUE(payment_id,kind)`. | Falta varredura de todos os caminhos “ler, decidir, gravar” em pedidos, estoque, mídia, visitas e financeiro, com testes concorrentes. Não afirmar que estão livres de corrida. |
| Testes | Existem 105 arquivos `*.test.ts` no Worker e 123 testes `*.test.ts(x)` no frontend, com Vitest/Cloudflare test. O handoff registra 397/397 Worker e 423/423 frontend em rodada anterior. | **Não foram reexecutados** nesta auditoria: o projeto fonte está fora da raiz de escrita autorizada, e testes podem gerar arquivos locais. Números históricos não validam mudanças recentes. Priorizar integração de cadastro, pagamento, webhook duplicado/concorrente, cancelamento e isolamento entre tenants. |
| Separação de responsabilidades | Módulos de domínio existem; o Worker importa regras de `frontend/src/lib` (`AGENTS.md`). `worker/src/index.ts` reúne roteamento público, autorização e fluxos operacionais, enquanto `billing.ts` concentra gateway, contrato, webhook e comissão. | `billing.ts` é o primeiro candidato a separar em cliente Asaas, orquestração de contrato e aplicação de eventos, depois de testes de caracterização. Refatorar sem mudar contratos ou regras. |

## O que não foi verificado

1. **Git atual e histórico de segredos:** `git -C C:\CARDAPIO-ANFC\Anfc-Cardapios` retornou `Permission denied` no ambiente desta auditoria. Não concluir que não há segredos antigos no histórico.
2. **Banco remoto:** não foi feita consulta a `sqlite_master`, `d1_migrations`, contagens de violações, `EXPLAIN QUERY PLAN`, métricas de custo ou comparação exata de schemas. Documentos históricos de 21/11 apontam homologação até `0035`, mas isso não foi revalidado agora.
3. **Backup e produção:** não houve teste de restore, inventário de permissões Cloudflare, confirmação de plano D1, segredos de produção, domínio final ou proteção WAF.
4. **Comportamento de todos os fluxos:** a homologação de duas indicações e duas cobranças sandbox ocorreu em 23/11 e consta no relatório da landing, mas não substitui testes de cancelamento, maturação de sete dias, repasses ou uso real em produção.

## Ordem recomendada

1. Sincronizar e testar a correção de cobrança do Asaas na fonte principal; evita regressão no próximo deploy.
2. Garantir recuperação: exportação externa e ensaio de restauração em banco separado.
3. Cobrir integração e concorrência em pagamento, webhook, cancelamento, repasse e isolamento por restaurante.
4. Medir consultas e custo D1 antes de criar índices ou mudar paginação.
5. Consolidar documentação e versões de homologação/produção; depois reavaliar estrutura de módulos.

**Nota sobre o relatório antigo:** `C:\CARDAPIO-ANFC\Anfc-Cardapios\AUDITORIA.md` é de 11/10/2026 e descreve uma arquitetura anterior. Deve ser preservado como histórico, não usado como diagnóstico atual sem revalidação.
