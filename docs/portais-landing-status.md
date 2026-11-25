# Portais na landing — atualizado em 24/11/2026

## Situação mais recente

- Em 24/11, a revisão visual acessou o Preview `https://cardap-io-landing-ayq25imt3-rj-6821.vercel.app`. Páginas públicas, cadastro, entradas de admin/afiliado e páginas legais foram conferidas em 1280 px e 390 px. Textos e cartões apareceram; não foi reproduzida a falha anterior de conteúdo invisível. Detalhes em `REVISAO-VISUAL-2026-11-24.md`.
- O menu móvel e a troca de tema exibem uma máscara transitória que cobre parte da tela durante a animação. Depois de concluída, a interface fica legível. Convém suavizar e verificar em aparelho real.
- As rotas internas do admin redirecionaram para o login sem sessão. Os painéis autenticados de admin e afiliado **não foram reavaliados em 24/11**; a verificação autenticada abaixo é a da rodada anterior.
- O formulário **publicado** em 24/11 ainda não mostrava CPF/CNPJ. O campo está somente na alteração local de `RegistrationForm.tsx`. Não há confirmação de novo deploy nem de cobrança inicial pela versão atualizada.
- Em 24/11, 40/40 testes passaram. A checagem de tipos passou após remover tipos gerados antigos em `.next/dev/types`; não houve mudança de código fonte nessa limpeza.

As informações de deploy e transações abaixo são o registro da homologação de 23/11, não uma nova checagem da configuração remota em 24/11.

## Arquitetura

- A landing Next.js em `C:\CARDAPIO-LANDING` contém páginas públicas, cadastro, portal do afiliado e administração. O SaaS do restaurante permanece no frontend Cloudflare.
- Branch Preview `codex/portais-landing-preview` na Vercel. Último commit publicado da landing: `48d9f4d`; deploy `dpl_2ABATGSwmrtTH99dsSK1d63izkmA` pronto em `https://cardap-io-landing-gt0n8h4av-rj-6821.vercel.app`. Produção de `mycardap.io` não foi alterada.
- Preview protegido por autenticação Vercel. `PLATFORM_API_URL` aponta para a API de homologação `https://anfc-cardapios-gestao-homologacao.nevepsiquica333.workers.dev`; `NEXT_PUBLIC_SAAS_URL` aponta para o frontend SaaS de homologação. A API usa D1 `anfc-gestao-homologacao` e Asaas **sandbox**.
- Administração e afiliados têm autenticação própria. A landing encaminha suas chamadas à API Cloudflare com cookies HttpOnly, sem cache e com bloqueio de POST de origem divergente.

## Homologação ponta a ponta

- Admin com TOTP e afiliado de teste entraram no Preview. Restaurantes, Afiliados, Repasses, Atendimento e Auditoria abriram. Tema claro e escuro, textos e cartões foram conferidos em celular e desktop.
- Código fictício de afiliado `FA896ACA4588`. O link preencheu o cadastro na landing. Restaurantes fictícios A (`24baf288-76b9-446b-9e7e-d2ff63e7a247`) e B (`552f1033-2ade-4655-aa31-56284e803108`) foram criados no plano Essencial de R$ 79/mês, com Pix sandbox. Ambas as indicações foram aprovadas no admin.
- A criação de cobranças revelou dois requisitos do Asaas: cabeçalho `User-Agent` e CPF/CNPJ do pagador. O Worker de homologação foi corrigido e publicado na versão `ba1b5b38-16d0-44cd-a8d6-d970da8a04b5`. A cópia de trabalho do SaaS está em `.saas-work/affiliate-approval`. A correção preserva o wrapper de sessão que evita importação circular entre `auth.ts` e `billing.ts`.
- Documentos sintéticos foram adicionados **somente** aos perfis A/B de homologação. Cobranças Pix A `pay_0_l6chzh8jd1q2tw` e B `pay_0_i6zfwuuo0qkh53` foram geradas e confirmadas pela operação exclusiva do Asaas sandbox, sem dinheiro real. Webhooks mudaram ambas as assinaturas para `active` e criaram duas comissões de R$ 15,60, equivalentes a 20% do líquido recebido.
- Após A, o portal mostrou 1 de 2 restaurantes válidos, R$ 15,60 registrados e R$ 0,00 disponível. Após B, mostrou 2 de 2, R$ 31,20 registrados e R$ 0,00 disponível durante a reserva de sete dias. O admin mostrou os mesmos valores e ambas as revisões `approved`. Nenhum repasse Pix foi feito.
- Testes da landing: 40/40 e tipagem aprovados após a inclusão do campo CPF/CNPJ. Tipagem do frontend SaaS passou; testes de cobrança do Worker: 3/3 e tipagem aprovados.

## Ainda não publicado

- `src/app/cadastro/RegistrationForm.tsx` coleta CPF/CNPJ para as próximas assinaturas, mas ainda precisa de commit, push e deploy Preview na Vercel.
- `.saas-work/affiliate-approval/frontend/src/app/cadastro/page.tsx` também coleta o documento no cadastro legado do SaaS, mas o frontend Cloudflare de homologação ainda não recebeu essa mudança.
- O Worker de homologação já recebeu a correção. O código correspondente no repositório principal do SaaS, fora deste workspace, precisa ser sincronizado e versionado para não se perder em outro deploy.

## Pendências para lançamento

1. Publicar o formulário atualizado da landing no Preview e testar um cadastro novo com CPF/CNPJ, confirmando a cobrança na primeira tentativa.
2. Sincronizar e versionar as correções do Worker e do formulário legado no repositório principal do SaaS; publicar o frontend legado em homologação.
3. Verificar no sandbox o cancelamento até o sétimo dia, a anulação da comissão sem estorno, a maturação após sete dias e a fila de repasses. Não fazer Pix para a conta fictícia.
4. Remover o Worker temporário `anfc-asaas-diagnostico-homologacao`, criado para identificar o erro `user_agent_not_informed`. A exclusão não foi executada porque a revisão automática da ferramenta atingiu o limite de uso. O endpoint público `/check` devolve apenas status e códigos de erro, sem credenciais ou dados da conta, mas deve ser removido assim que a revisão voltar a estar disponível.
5. Preparar API, banco, chaves e webhook **de produção** separados do sandbox; validar domínio e fluxos antes de apontar `mycardap.io` para a nova landing.

## Regras do programa

- Comissão de 20% do líquido recebido enquanto o restaurante indicado permanecer cliente.
- Mínimo de dois restaurantes distintos, pagos e aprovados para habilitar repasse.
- Cada comissão aguarda sete dias após o pagamento; cancelamento da assinatura nesse período elimina a comissão, mesmo sem estorno.
- Administrador aprova e registra repasses manuais. O Pix é feito fora do sistema e só deve ser marcado como pago após confirmação efetiva.
