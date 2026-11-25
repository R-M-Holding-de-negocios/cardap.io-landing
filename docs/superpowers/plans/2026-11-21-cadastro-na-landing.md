# Cadastro na landing Implementation Plan

**Goal:** Substituir o redirecionamento por formulário completo na landing, preservando plano e indicação, com criação de conta pelo Worker e login posterior no app.

**Architecture:** A página estática da landing usa um componente interativo para ler plano/afiliado e enviar o cadastro diretamente ao Worker por HTTPS, sem cookies. O Worker aplica CORS restrito à rota de cadastro e às origens configuradas. O visitante entra no app com a senha criada para acessar a cobrança. A rota `/r/<código>` do app poderá apontar à landing quando uma origem pública confiável estiver configurada.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Worker Hono existente.

**Spec:** `docs/superpowers/specs/2026-11-21-cadastro-na-landing-design.md`

## Restrições globais

- Corpo JSON até 16 KiB; plano `basic|essential|pro`; pagamento `PIX|BOLETO|CREDIT_CARD`; indicação com 12 caracteres alfanuméricos.
- Não persistir senha na landing nem incluir credenciais/dados pessoais na URL.
- Não publicar formulário com destinos SaaS/API ausentes, inseguros ou iguais à própria landing.

## Foco de revisão

- Plano vindo do CTA errado ou ausente deve cair no plano Essencial.
- Código de afiliado em URL deve ser preservado sem aceitar formato inválido.
- Erros do Worker devem aparecer ao visitante sem detalhes internos.
- Timeout do destino deve produzir mensagem recuperável, sem novo cadastro local.
- Cadastro concluído deve encaminhar ao login do app para abrir a cobrança.

## Tarefa 1: links da landing

**Arquivos:** `src/lib/product-url.ts`, `src/app/page.tsx`, `src/components/public/Navbar.tsx`, `src/components/public/Footer.tsx`, `test/product-url.test.ts`.

- [ ] Alterar o teste para exigir `/cadastro` local e `?plan=` preservado; observar falha.
- [ ] Implementar helper de URL local e trocar CTAs; verificar testes.

## Tarefa 2: destino seguro da API

**Arquivos:** `src/lib/registration-api.ts`, `test/registration-api-url.test.ts`.

- [ ] Testar destino configurado e rejeição de origem insegura ou igual à landing; observar falhas.
- [ ] Implementar URL de API pública; verificar testes.

## Tarefa 3: formulário

**Arquivos:** `src/app/cadastro/page.tsx`, `src/app/cadastro/RegistrationForm.tsx`, `e2e/registration.spec.ts`.

- [ ] Testar campos, plano/indicação inicial, erro e conclusão; observar falhas.
- [ ] Implementar formulário com estados acessíveis e link final para login; verificar testes.

## Tarefa 3b: CORS restrito no Worker

**Arquivos:** `worker/src/index.ts`, `worker/test/landing-registration-cors.test.ts`, `worker/wrangler.gestao-staging.jsonc` no projeto SaaS.

- [ ] Testar preflight permitido/rejeitado e resposta de cadastro; observar falhas.
- [ ] Implementar política só na rota de cadastro, acrescentar origem local à homologação e verificar pela rede.

## Tarefa 4: indicação no app

**Arquivos:** `frontend/src/app/r/[code]/page.tsx` e testes no projeto SaaS.

- [ ] Testar redirecionamento para origem pública configurada e fallback local; observar falhas.
- [ ] Implementar redirecionamento sem abrir origem arbitrária; verificar testes.

## Tarefa 5: verificação e publicação

- [ ] Rodar suítes, typechecks e builds dos pacotes afetados.
- [ ] Homologar cadastro → login → pagamento no Asaas sandbox antes de alterar a landing pública.
- [ ] Atualizar guia do projeto com resultado e pendências de produção.
