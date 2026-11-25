# Homologação de afiliados e cadastro — 21/11/2026

> Registro histórico de 21/11. A landing e os portais foram publicados depois no Preview de homologação. Para o estado mais recente, usar `portais-landing-status.md`, `REVISAO-VISUAL-2026-11-24.md` e `pre-publicacao.md`. As etapas abaixo não devem ser lidas como tarefas ainda abertas sem conferir esses documentos.

## Estado confirmado

- Painel de homologação: `https://anfc-cardapios-web-gestao-homologacao.nevepsiquica333.workers.dev/admin`. A primeira conta administrativa tem TOTP configurado e sessão ativa; o proprietário abriu Restaurantes, Afiliados, Repasses e Atendimento.
- API sandbox: `https://anfc-cardapios-gestao-homologacao.nevepsiquica333.workers.dev`. D1 `anfc-gestao-homologacao` com migrações até `0035`; backup restrito em `C:\CARDAPIO-LANDING\.saas-work\backups\anfc-gestao-homologacao-before-admin-2026-11-21.sql`.
- Candidatura fictícia **Afiliado de Homologação** aprovada. Login e dashboard responderam 200, com zero restaurantes, mínimo dois e saldo liberado zero. A primeira visita ao link foi registrada. Credenciais e código em `C:\CARDAPIO-LANDING\.saas-work\secrets\afiliado-homologacao-teste.txt`, arquivo local com acesso restrito. Chave Pix fictícia: não fazer repasse real.
- Landing local: formulário completo em `/cadastro`, com plano, forma de pagamento e indicação; Next atualizado para 16.4.6. Testes unitários 36/36, typecheck e dois cenários Chromium passaram. O formulário ainda **não** está na Vercel. A API sandbox aceita CORS para `http://localhost:3001` somente na rota de cadastro; preflight e bloqueio de outra origem foram verificados pela rede.
- O endereço público `mycardap.io` continua ligado à landing antiga. O app de homologação ainda envia `/r/<código>` ao `/cadastro` do próprio app. As credenciais Asaas identificadas em `worker/.dev.vars` e no Worker de homologação são de **sandbox** (`ASAAS_ENV=sandbox`); não comprovam produção.

## Como testar o afiliado no sandbox

1. Entrar no [portal do afiliado](https://anfc-cardapios-web-gestao-homologacao.nevepsiquica333.workers.dev/partner/login) usando o arquivo restrito acima. Conferir código, visitas e aviso de dois restaurantes mínimos.
2. Abrir o link de indicação exibido no portal. Na versão publicada, ele ainda abre o formulário do app; a landing local nova aceita `?ref=<código>` e deve substituí-lo após publicação segura.
3. Criar dois restaurantes **fictícios distintos**, com e-mails e telefones de teste, usando o mesmo código. Escolher cobranças do Asaas sandbox; não fazer pagamento real.
4. No painel Asaas sandbox, confirmar as cobranças de teste e verificar que webhooks tiveram resposta 200. No painel administrativo, revisar cada indicação. Antes da segunda indicação paga e aprovada, nenhum repasse deve ficar disponível.
5. Verificar no portal as duas atribuições e as comissões de 20% sobre o líquido recebido. Cada comissão fica em conferência por sete dias. Se a assinatura for cancelada nesses sete dias, a comissão do pagamento deve ser anulada mesmo sem estorno.
6. Após a maturação, a fila de repasses deve mostrar prazo e saldo. A aprovação reserva saldo; somente marcar pago após um Pix efetivo. Para a conta fictícia, **não realizar Pix**; testar apenas os estados que não implicam saída de dinheiro.

## Pendências e bloqueio de operação

- Ainda faltam cadastro real ponta a ponta no Asaas sandbox, confirmação de pagamentos de teste, duas indicações qualificadas e o ciclo de sete dias. Testes automatizados de regras não comprovam essas integrações reais.
- A landing precisa de `NEXT_PUBLIC_SAAS_URL` e `NEXT_PUBLIC_API_URL` HTTPS válidos antes da publicação na Vercel. A produção precisa de credenciais Asaas próprias e origem final. Não apontar a landing pública ao sandbox.
- A revisão automática de ações externas atingiu limite de uso durante a tentativa de iniciar o teste de cadastro vivo. O retorno declarou que não houve reprovação por risco; a verificação não pôde ser concluída. Não contornar essa revisão. As alterações locais posteriores ainda precisam ser sincronizadas e publicadas quando a revisão estiver disponível.
- Um build estático passou antes do último ajuste de validação das URLs; o build posterior, no ambiente restrito, falhou com `EPERM` ao criar diretórios em `.next`, embora compilação e TypeScript tenham passado. Repetir o build em ambiente com permissão normal antes da publicação.
