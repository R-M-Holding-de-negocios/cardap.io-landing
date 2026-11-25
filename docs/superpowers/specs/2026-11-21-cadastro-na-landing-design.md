# Cadastro de restaurante na landing

## 1. Objetivo e escopo

O restaurante deve preencher na landing `mycardap.io/cadastro` os dados da conta, plano, forma de pagamento e código opcional de afiliado. A landing é um repositório separado do app. Ela não deve redirecionar ao formulário `/cadastro` do app. Após criação, o usuário faz login no app com a senha criada e acompanha a cobrança; a API não cria sessão durante o registro e os domínios são distintos.

## 2. Fluxo

CTAs e cartões de plano da landing abrem `/cadastro` na própria landing, preservando `plan`. Um link de afiliado redireciona para `/cadastro?ref=<código>`; o formulário mantém e mostra o código. O usuário escolhe Basic/Essencial/Pro e PIX/Boleto/Cartão, preenche restaurante, proprietário, e-mail, telefone e senha. A landing envia os dados ao seu próprio handler. Após sucesso, mostra confirmação e link para o login do app; não coloca e-mail, senha, chave Pix nem dados de cobrança na URL.

## 3. Contratos

Como a landing usa `output: 'export'`, ela não executa Route Handler. O componente envia JSON diretamente ao Worker em `NEXT_PUBLIC_API_URL` via HTTPS, sem cookies; o Worker permite CORS somente para `/api/auth/register` e origens exatas em `ALLOWED_ORIGINS`. A resposta pode incluir dados de cobrança, mas o componente usa apenas sucesso ou erro e não registra o restante. As origens do app e da API precisam ser distintas da landing e HTTPS na publicação pública. A landing precisa de `NEXT_PUBLIC_SAAS_URL` e `NEXT_PUBLIC_API_URL` configurados no destino de publicação.

## 4. Bordas e segurança

Limitar corpo a 16 KiB no Worker; rejeitar origem cruzada, plano ou método desconhecido, senha fora de 12–72 bytes e `ref` inválido no Worker. Preservar limite de tentativas. A landing não guarda senha nem envia cookies. Exigir configuração de origens válidas antes de liberar o formulário público. Pagamento real e termos contratuais finais dependem de homologação/decisões separadas.

## 5. Testes

Teste das URLs de CTA locais e plano preservado; teste de configuração da URL pública da API; teste de preflight permitido/rejeitado no Worker; teste no navegador do formulário, código de afiliado, erro e estado de sucesso com link de login. Verificar typecheck e build estático da landing.

## 6. Etapas

1. Escrever testes e observar falhas esperadas.
2. Implementar URLs, formulário e handler.
3. Executar testes, typecheck e build.
4. Ajustar links de afiliado do app para enviar à landing somente quando a origem pública estiver configurada.
5. Homologar cadastro → login → pagamento no sandbox antes de publicar a landing.
