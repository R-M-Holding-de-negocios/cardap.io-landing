# Contas, afiliados e promoções — levantamento para o SaaS principal

Data: 14/11/2026. Projeto de implementação: `C:\CARDAPIO-ANFC\Anfc-Cardapios` (fora da área de escrita desta sessão). Este documento registra o desenho antes de alterações em autenticação, cobrança ou banco. Regras comerciais pendentes de confirmação estão marcadas.

## Contexto e estado real

- `frontend/src/app/login/page.tsx` usa `/api/auth/login`; `worker/src/auth.ts` emite sessão com token aleatório, guarda apenas o hash em D1 e define cookie HttpOnly/SameSite=Lax por oito horas. O cookie já pode sobreviver ao fechamento do navegador, mas a sessão expira após oito horas. Há logout e gestão de sessões em `worker/src/account.ts`.
- `frontend/src/app/parceiros/page.tsx` envia candidatura a `/api/partners/apply`. A rota Next atual retorna código e sucesso sem gravar. O Worker tem uma rota distinta que grava candidaturas em `partner_applications`, porém o formulário não a utiliza.
- `frontend/src/app/partner/login/page.tsx` exibe link `PARCEIRO25`, métricas e restaurantes fixos, sem autenticação de afiliado. `/r/[code]` apenas encaminha a `/cadastro?ref=...`; o cadastro atual lê apenas `plan`, e o Worker não grava atribuição ao parceiro.
- `worker/migrations/0024_saas_billing.sql` cria contratos de cobrança e eventos Asaas. `worker/src/billing.ts` reconcilia eventos com o provedor, base necessária para comissões auditáveis. Não há tabela de cupom, atribuição, lançamento de comissão ou repasse.
- A referência de produto, seção 5 de `docs/reference/agents-original.md`, descreve 25% mensal sobre faturas líquidas liquidadas, Pix dia 10 e proibição de autoindicação. Essa referência não comprova regra comercial aprovada nem implementação atual.

## Requisitos e critérios de aceite propostos

1. **Acesso persistente.** Após confirmação do significado de “guardar login”, oferecer opção explícita “Manter conectado” ou manter política de sessão atual e adicionar histórico de acessos. Nunca guardar senha/token em `localStorage`. Sessões persistentes devem ser revogáveis, rotacionadas quando necessário e protegidas por HttpOnly, Secure e SameSite. Histórico, se solicitado, deve ter retenção definida e limitar IP/dispositivo expostos ao usuário.
2. **Candidatura e aprovação de afiliado.** Validar e persistir solicitação no backend; não mostrar aprovação antes da decisão administrativa. Criar identidade de afiliado separada do restaurante, autenticação própria e estado de candidatura. Não emitir link ativo para candidatura pendente.
3. **Código de afiliado.** Gerar código imprevisível/único, vinculado ao afiliado aprovado; validar no servidor, registrar eventos de indicação e associar uma única origem ao restaurante no cadastro. Aplicar regra anti-autoindicação e resolver conflitos entre link, código e acessos repetidos. Não usar `Math.random` para identificadores de segurança.
4. **Código promocional.** Confirmar elegibilidade, porcentagem ou valor fixo, vigência, limite de uso, recorrência e possibilidade de combinar com indicação. Calcular desconto no servidor antes de iniciar cobrança; apresentar preço final e validade ao cliente; registrar versão da promoção no contrato. O valor enviado ao Asaas deve ser exatamente o valor confirmado na interface.
5. **Comissões.** Calcular sobre cobranças efetivamente liquidadas após desconto e estorno, conforme regra comercial aprovada. Usar eventos idempotentes do provedor para criar lançamentos imutáveis, ajustes de estorno e estado de repasse. Não apresentar “a receber” como pago.
6. **Painel do afiliado.** Exigir sessão própria em cada API. Mostrar apenas seus códigos, cliques confirmados, restaurantes atribuídos, estado de assinatura, comissões pendentes/aprovadas/pagas e histórico de repasses. Minimizar dados de restaurantes: nome e situação comercial necessários; não expor contatos, dados de pagamento ou pedidos sem base e necessidade.
7. **Privacidade e termos.** Integrar ao SaaS principal os documentos legais e o consentimento da landing após inventário de cookies e provedores. Registrar aceite contratual separado do consentimento para tecnologias opcionais no cadastro real.

### Cenários essenciais

- Dado um afiliado pendente, quando tenta abrir o painel, então não recebe métricas nem código ativo.
- Dado um afiliado aprovado, quando abre o painel, então vê só restaurantes e lançamentos atribuídos ao seu identificador.
- Dado um código inválido, expirado ou inelegível, quando o cliente tenta contratar, então o servidor rejeita o desconto e mantém preço original visível antes da confirmação.
- Dado o mesmo webhook de pagamento recebido duas vezes, quando é processado, então existe um único lançamento de comissão.
- Dado estorno ou chargeback, quando confirmado pelo provedor, então o saldo do afiliado recebe ajuste rastreável sem apagar o lançamento original.
- Dado logout ou revogação de sessão, quando o token antigo é reutilizado, então o backend retorna 401.

## Arquitetura e segurança

Adicionar migração **aditiva** em D1 para `affiliate_accounts`, `affiliate_codes`, `affiliate_attributions`, `promotions`, `promotion_redemptions`, `commission_ledger` e `affiliate_payouts`, com chaves e índices de unicidade. Avaliar se candidaturas existentes podem ser vinculadas sem migração destrutiva. Implementar rotas de afiliado no Worker com validação de entrada, autorização por `affiliate_id`, rate limit e respostas sem dados sensíveis; encaminhar rotas Next pelo service binding já usado em autenticação. Atribuição e desconto devem ser gravados no momento do cadastro/contrato, não somente no navegador. Eventos de cobrança devem ser reconciliados com o Asaas e gerar lançamentos idempotentes. Logs devem omitir senha, token, chave Pix e dados de cartão.

## Plano de testes e execução

1. Testes de contrato para candidatura, aprovação, login/logout, sessão persistente/histórico e isolamento entre afiliados.
2. Testes de atribuição: código inválido, repetido, expirado, conflito entre códigos, autoindicação e cadastro simultâneo.
3. Testes de desconto: arredondamento em centavos, limites, expiração, recorrência, alteração de plano e valor enviado ao provedor.
4. Testes de comissão: pagamento duplicado, estorno, reembolso parcial, chargeback e repasse.
5. Testes de navegador para cadastro, login, cupom, painel responsivo, teclado e estados vazios/erro.
6. Executar testes existentes do frontend/Worker, typecheck, build e migrações **locais**. Não aplicar migração remota ou alterar cobranças reais nesta etapa.

Antes de produzir código no repositório principal, confirmar as três decisões comerciais solicitadas ao proprietário e obter permissão de escrita para a pasta externa ao workspace. Preservar todas as alterações não commitadas existentes naquele repositório.
