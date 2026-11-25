# Aprovação de afiliados Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir decisão operacional auditada de candidaturas de afiliados sem expor uma API administrativa pública.

**Architecture:** Uma migração D1 aditiva guarda a decisão na conta e usa trigger para sincronizar a candidatura e criar a trilha de auditoria em uma única instrução SQL. Um script local chama Wrangler com as credenciais operacionais existentes; `--remote` precisa ser explícito. A página pública passa a descrever apenas comissões registradas, sem prometer transferência automática.

**Tech Stack:** Cloudflare D1, Wrangler, TypeScript/Vitest no Worker, Node.js no script, Next.js/React/Vitest no frontend.

**Spec:** `docs/superpowers/specs/2026-11-14-aprovacao-afiliados-design.md` neste repositório de origem; código no projeto principal `C:\CARDAPIO-ANFC\Anfc-Cardapios`.

## Global Constraints

- Não criar endpoint público de aprovação.
- Não aplicar migração remota, publicar Worker/frontend ou realizar pagamentos nesta implementação.
- Preservar senha/hash, chave Pix e sessão fora de logs e saídas do script.
- Proibir transições repetidas e garantir estado atômico entre conta, candidatura e auditoria.
- Manter os arquivos e alterações existentes no projeto principal.

## Review Focus

- ID de candidatura com caracteres SQL especiais não pode alterar outra conta; teste de entrada rejeitada no script.
- Decisões simultâneas não podem criar duas linhas de auditoria; teste de segunda decisão conflitante.
- Candidatura antiga sem `affiliate_accounts` não pode ser aprovada; teste de ID ausente.
- Falha no trigger não pode deixar conta aprovada sem candidatura/auditoria; teste de rollback.
- `--remote` não pode ser ativado por padrão; teste dos argumentos do Wrangler.

---

### Task 1: Persistência atômica da decisão

**Files:**
- Create: `worker/migrations/0026_affiliate_decisions.sql`
- Create: `worker/test/affiliate-approval.test.ts`

**Interfaces:**
- Produces: `affiliate_accounts.decision_operator`, `decision_reason`, `decided_at`; tabela `affiliate_decisions`; trigger `affiliate_decision_after_status`.
- Consumes: `affiliate_accounts` e `partner_applications` das migrações existentes.

- [ ] Escrever testes Vitest para aprovar, rejeitar, segunda decisão, ID ausente e rollback causado por candidatura ausente. Cada teste cria candidatura pelo endpoint existente e decide por `UPDATE affiliate_accounts SET status=?,decision_operator=?,decision_reason=?,decided_at=? WHERE id=? AND status='pending' RETURNING id,status`.
- [ ] Executar `npm test -- test/affiliate-approval.test.ts` em `worker/`; esperado: falha por colunas/tabela/trigger ausentes.
- [ ] Criar migração aditiva: três colunas de decisão; tabela de auditoria com `affiliate_id UNIQUE`, estados anterior/novo, operador, motivo e instante; trigger `AFTER UPDATE OF status` restrito à transição de `pending` para `approved`/`rejected`, que exige candidatura existente, atualiza `partner_applications.data` por `json_set`, e insere auditoria. Se faltarem operador, instante ou candidatura, a instrução falha inteira.
- [ ] Reexecutar teste focado; esperado: todos os cenários passam. Rodar `npm run typecheck` em `worker/`.

### Task 2: Ferramenta operacional restrita

**Files:**
- Create: `worker/scripts/affiliate-review.mjs`
- Create: `worker/scripts/affiliate-review.test.mjs`
- Modify: `worker/package.json`

**Interfaces:**
- Consumes: esquema e instrução de decisão da Task 1.
- Produces: `npm run affiliates:review -- list|approve|reject <id> --operator <identidade> [--reason <texto>] [--remote]`.

- [ ] Escrever testes Node `node --test scripts/affiliate-review.test.mjs` para análise de argumentos, listagem sem chave Pix, decisão com parâmetros escapados, conflito/ID ausente, `--remote` explícito e erros do Wrangler sem vazamento de dados.
- [ ] Executar o teste; esperado: falha porque o script não existe.
- [ ] Implementar script com `execFileSync` apontando para Wrangler do pacote local, `--json`, `--local` por padrão e `--remote` somente se pedido. Restringir ID e operador a formato seguro; validar tamanho de motivo. Listar somente id, nome, e-mail e data das candidaturas pendentes. Não imprimir SQL bruto nem saída integral em erro.
- [ ] Rodar o teste Node e o teste focado do Worker; esperado: ambos passam.

### Task 3: Mensagem pública fiel ao estado real

**Files:**
- Modify: `frontend/src/app/parceiros/page.tsx`
- Create: `frontend/test/partner-payout-copy.test.tsx`

**Interfaces:**
- Consumes: estado atual, que registra comissões e ainda não executa repasses Pix.
- Produces: texto da página sem promessas de repasse automático ou data garantida.

- [ ] Escrever teste de conteúdo para os trechos de repasse automático e ausência de notas fiscais; exigir mensagem de que comissões são registradas e repasses dependem de validação operacional.
- [ ] Rodar `npm test -- test/partner-payout-copy.test.tsx` em `frontend/`; esperado: falha por texto atual.
- [ ] Ajustar somente as afirmações de repasse da página, preservando formulário e cálculo demonstrativo. Não anunciar política comercial ainda não confirmada.
- [ ] Rodar teste focado, `npx tsc --noEmit` e `npm run build` em `frontend/`; esperado: aprovação.

### Task 4: Verificação final e documentação de operação

**Files:**
- Create: `docs/affiliates/approval-operations.md` no projeto principal.
- Modify: `docs/affiliates/implementation-status.md` no projeto principal.

**Interfaces:**
- Consumes: comando e migração das Tasks 1–3.
- Produces: instruções de revisão, backup, aplicação de migração e decisão, incluindo uso local/remoto, sem executar operação remota.

- [ ] Documentar ordem de aplicação da migração, comando de listagem/decisão, confirmação do resultado e tratamento de candidatura legada.
- [ ] Executar testes focados Worker/Node/frontend e typecheck dos dois pacotes; registrar resultados exatos e falhas preexistentes.
- [ ] Conferir diff e status do Git; garantir ausência de mudanças remotas e de arquivos não relacionados.
