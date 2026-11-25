# Auditoria da landing Cardap.io — 23/11/2026

## Escopo e limite

Revisão do código local em `C:\CARDAPIO-LANDING`, dos testes automatizados e do registro de homologação em `docs/portais-landing-status.md`. Abrange apresentação, cadastro de restaurantes, portal de afiliados, administração, páginas legais e ligação com a API de Gestão. Esta revisão não altera a produção nem comprova o estado atual do domínio público. O Preview documentado foi publicado no commit `48d9f4d`; o campo CPF/CNPJ visto no código local ainda não fazia parte desse deploy.

## Resumo

**Estado:** estrutura funcional em homologação, com publicação de produção pendente. O principal impedimento para abrir o cadastro ao público é a combinação de textos legais desatualizados, configuração de produção ainda não validada e uma alteração necessária ao primeiro pagamento que ainda não foi publicada.

## Achados por prioridade

### Alta — páginas legais descrevem uma versão antiga do produto

- `src/app/termos-de-uso/page.tsx:8-14` afirma que a landing não cria contas, que os links levam ao sistema principal e contém campos `[PREENCHER]`. Hoje `/cadastro` cria a conta pela própria landing e `/parceiros` recebe candidaturas.
- `src/app/politica-de-privacidade/page.tsx:8-12` descreve apenas tema, preferências e logs técnicos, mas os formulários recebem dados pessoais, dados para cobrança, chave Pix e credenciais. Ainda faltam responsável, contato, prestadores e prazos de retenção.
- `src/app/politica-de-cookies/page.tsx:8-11` diz que a landing não define cookies HTTP. Os logins de administrador e afiliado agora usam cookies de sessão encaminhados pelo proxy. A política também contém campos `[PREENCHER]`.

**Ação:** atualizar os três documentos conforme o fluxo real, identificar responsável e canais, inventariar cookies e prestadores e revisar as condições comerciais e o aceite no cadastro. A revisão jurídica e de privacidade precisa ser feita por quem responde pelo serviço antes da abertura pública.

### Alta — o formulário local de cobrança ainda não foi publicado

`src/app/cadastro/RegistrationForm.tsx:39,76` coleta e envia CPF/CNPJ para a emissão da mensalidade. O arquivo está modificado localmente; `docs/portais-landing-status.md:21-27` confirma que ainda faltam commit, publicação no Preview e novo teste de cadastro. O Preview vigente corresponde ao commit `48d9f4d`.

**Ação:** publicar a versão atualizada no Preview e confirmar, com um cadastro novo, criação de conta, cobrança inicial, retorno de erro e aplicação da indicação. Depois promover a versão validada.

### Alta — separar e validar toda a configuração de produção

`src/lib/platform-api.ts:2-5` exige URL de API e HTTPS no ambiente publicado, mas não distingue por código uma API de homologação de uma API de produção. O Preview documentado aponta para Cloudflare e Asaas de homologação (`docs/portais-landing-status.md:6-7`). A produção `mycardap.io` não foi alterada por esse trabalho.

**Ação:** conferir variáveis de ambiente, domínio, API, banco e credenciais de cobrança no projeto de produção antes da publicação. Uma URL HTTPS de homologação passaria pela checagem atual, portanto a conferência da configuração é indispensável.

### Média — validação de cadastro pode gerar erros pouco claros

O campo CPF/CNPJ em `src/app/cadastro/RegistrationForm.tsx:76` aceita de 11 a 18 caracteres com pontuação, o que permite alguns comprimentos de dígitos inválidos; o servidor faz a validação final. A senha usa limites de caracteres no navegador, enquanto a validação do serviço pode considerar bytes. O cadastro não apresenta um controle explícito de aceite dos termos no formulário.

**Ação:** alinhar as validações de navegador e servidor, mostrar o motivo útil de rejeição sem expor dados sensíveis e definir o mecanismo de aceite junto à revisão dos termos.

### Média — controles de publicação e cobertura final ainda precisam de evidência

Não há configuração própria de cabeçalhos de segurança em `next.config.mjs`, nem foram verificados nesta revisão os cabeçalhos entregues pela Vercel. Os testes automatizados passaram, mas não cobrem integralmente o fluxo real de cobrança, cookies e publicação. `npm run build` não concluiu localmente por `EPERM` ao criar `.next/server/app/termos-de-uso`; isso é uma limitação de permissão deste ambiente, **não uma falha de código demonstrada**. O deploy anterior do commit publicado estava pronto na Vercel.

**Ação:** verificar os cabeçalhos na resposta publicada e executar build e fluxo de cadastro no Preview após a atualização.

## Controles observados

- Rotas administrativas exigem sessão válida no servidor; a API de Gestão continua responsável por autorizar cada operação.
- Os caminhos e métodos expostos pelo proxy administrativo e pelo portal de afiliados usam listas permitidas.
- O proxy restringe origem de pedidos com alteração de dados, seleciona o cookie de sessão pertinente, não encaminha cookies ao cadastro público, evita cache e usa timeout.
- O código exige HTTPS para a API em ambiente publicado e para o destino do SaaS nas configurações hospedadas.
- Os links de indicação validam o formato do código; a API continua responsável por validá-lo e atribuir a indicação.
- O Preview documentado teve acesso de administrador e afiliado, seções principais e temas claro e escuro conferidos em desktop e celular.

## Verificações executadas nesta auditoria

- `npm test -- --run`: **40 testes passaram em 8 arquivos**.
- `npm run typecheck`: **passou**.
- `npm run build`: **interrompido por permissão local `EPERM`** ao criar pasta em `.next`.
- Estado Git: `RegistrationForm.tsx` e `docs/portais-landing-status.md` modificados; há arquivos de documentação e artefatos locais ainda não rastreados. Esta auditoria não os alterou.

## Próxima sequência recomendada

1. Corrigir termos, privacidade e cookies com os dados reais do serviço; definir condições de contratação e aceite.
2. Ajustar a experiência do CPF/CNPJ e publicar o formulário no Preview.
3. Repetir cadastro completo em homologação, inclusive indicação, cobrança e falhas esperadas.
4. Conferir cabeçalhos e comportamento no Preview publicado.
5. Revisar configuração exclusiva da produção e só então publicar em `mycardap.io`.

## Fora do que foi comprovado aqui

Não foi feita auditoria independente do código do Worker de Gestão, do banco, da conta Asaas ou da configuração ativa do domínio de produção. Os resultados de homologação citados acima são os registrados no projeto, não uma nova transação executada durante esta revisão.
