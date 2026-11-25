# Aprovação de candidaturas de afiliados — proposta

Data: 14/11/2026. Implementação prevista no projeto principal `C:\CARDAPIO-ANFC\Anfc-Cardapios`. A primeira abordagem foi aprovada para implementação local; este documento não aprova migração ou implantação remota nem define política comercial.

## Contexto e problema

O formulário `/parceiros` grava candidatura e conta `pending`. O login e o código de indicação só funcionam quando `affiliate_accounts.status='approved'`. Hoje a aprovação é feita por alteração direta no D1; não há identidade de operador da plataforma, interface de análise nem trilha de decisão. Isso impede operar o programa com segurança e repetibilidade.

A página pública também promete repasse automático via Pix, enquanto o código apenas registra comissões. Esse texto deve refletir a operação real antes de divulgar o programa.

## Abordagens consideradas

1. **Fluxo operacional restrito primeiro (recomendação):** uma ferramenta de linha de comando no projeto principal lista candidaturas pendentes e registra aprovação ou rejeição com motivo, operador e instante. Usa acesso operacional já controlado ao D1, sem criar autenticação administrativa pública. É mais rápido, mas a análise não fica em uma tela web.
2. **Painel administrativo completo:** criar identidade e sessão próprias para operadores da plataforma, APIs de decisão e interface de análise. Dá melhor ergonomia, mas amplia a superfície de autenticação, autorização, recuperação de acesso e auditoria.
3. **Manter SQL manual:** preserva o estado atual e exige menos trabalho, mas não oferece trilha confiável nem validação consistente; não é recomendado para operação regular.

## Objetivo e limites da primeira etapa proposta

Permitir que um operador autorizado analise e decida candidaturas, sem acesso para proprietários de restaurantes ou afiliados. A aprovação não libera pagamentos Pix nem cria cupons promocionais. Não aplicar migração em produção ou publicar Worker/frontend nesta etapa.

## Requisitos e critérios de aceite

- Listar candidaturas pendentes com os dados mínimos para análise; tratar a chave Pix como dado sensível e não incluí-la em logs, relatórios ou saídas de teste.
- Aprovar ou rejeitar somente candidaturas `pending`; exigir identificação do operador e motivo registrado para rejeição. Registrar instante e transição anterior/nova em trilha de auditoria imutável.
- A decisão deve ser atômica: conta e candidatura passam ao mesmo estado, ou nenhuma é alterada. Uma segunda tentativa de decidir a mesma candidatura deve falhar com conflito sem sobrescrever a primeira decisão.
- Afiliado pendente ou rejeitado continua sem login, painel e link ativo. Afiliado aprovado pode entrar pelo fluxo já existente.
- O código de indicação existente permanece único e não é reemitido no ato da aprovação.
- A página `/parceiros` deixa de afirmar que o repasse Pix é automático enquanto não existir fluxo de pagamento comprovado.

### Cenários

- **Dado** um candidato pendente, **quando** o operador o aprova, **então** a conta e a candidatura ficam aprovadas, a decisão é auditada e o candidato pode usar o login existente.
- **Dado** um candidato pendente, **quando** o operador o rejeita com motivo, **então** o login segue bloqueado e a decisão fica auditada.
- **Dado** uma candidatura já decidida, **quando** outra decisão é enviada, **então** o sistema retorna conflito e preserva o histórico original.
- **Dado** erro de persistência em qualquer parte da decisão, **quando** a operação termina, **então** não há estado parcial.
- **Dado** um usuário sem privilégio operacional, **quando** tenta decidir candidatura pela API pública, **então** não existe rota de decisão acessível a ele.

## Design técnico proposto

Adicionar migração D1 **aditiva** para tabela `affiliate_decisions` com `id`, `affiliate_id`, `from_status`, `to_status`, `reason`, `operator_id`, `created_at` e restrição de unicidade por candidatura para a primeira decisão. Usar `UPDATE ... WHERE status='pending' RETURNING`; um trigger SQLite atualiza `partner_applications.data` e grava a auditoria na mesma instrução atômica. Não expor chave Pix no retorno nem no log.

Se a abordagem de linha de comando for escolhida, não aceitar uma string livre como prova de autorização em endpoint público: o operador executa a ferramenta com credenciais de infraestrutura já controladas e fornece sua identificação para a trilha. Se a abordagem web for escolhida, projetar autenticação de operador antes de qualquer endpoint de decisão, separada das sessões de restaurante e afiliado.

## Falhas e segurança

- ID inexistente: não alterar nada nem revelar dados de outra candidatura.
- Transições concorrentes: apenas uma vence; a segunda recebe conflito.
- Erro no D1: nenhuma aprovação parcial.
- Dados Pix, senha/hash, cookies e tokens: nunca em logs, mensagens de erro ou resposta pública.
- Candidaturas antigas sem conta ou senha: exigir onboarding seguro separado; não aprová-las por simples mudança de status.
- O operador deve verificar identidade e eventual conflito de autoindicação antes da aprovação. O bloqueio atual por e-mail igual não cobre propriedade indireta do restaurante.

## Plano de testes e execução incremental

1. Escrever testes de integração para aprovação, rejeição, conflito, atomicidade, login após aprovação e sigilo de dados; confirmar falha esperada antes de código de produção.
2. Adicionar migração e serviço de decisão; executar testes Worker e typecheck.
3. Criar interface operacional escolhida e seus testes; verificar que não há rota pública de aprovação sem autenticação adequada.
4. Corrigir a afirmação de repasse automático em `/parceiros`, com teste de conteúdo.
5. Rodar testes focados, suíte pertinente e build. Registrar falhas preexistentes separadamente. Não tocar em D1 remoto nem realizar transferências.

## Decisões ainda necessárias

- O fluxo operacional restrito foi escolhido para a primeira etapa; painel administrativo permanece uma possibilidade futura.
- Definir quem são os operadores autorizados e quais evidências precisam revisar antes de aprovar.
- Confirmar política de comissão e repasse antes de publicar promessas comerciais ou automatizar pagamentos.
