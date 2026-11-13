# Verificação antes da publicação

## Última validação local (13/11/2026)

- `npm.cmd test`: 26 testes aprovados.
- `npm.cmd run typecheck`: aprovado após excluir de `tsconfig.json` os modelos em `scripts/`, que importam módulos exclusivos do sistema principal.
- `npm.cmd run build`: exportação estática gerada para `/`, `/login` e `/cadastro`.
- O HTML estático desta pasta ainda contém destinos `http://localhost:3000`, pois é uma prévia isolada. O site público em `mycardap.io` usará o projeto principal integrado, com rotas internas.
- O sistema principal não estava acessível em `http://localhost:3000`; os fluxos integrados continuam sem verificação nesta rodada.

## Conferido nesta landing

- A navegação interna leva às seções `como-funciona`, `sistema`, `planos` e `atendimento`.
- Entrar, criar conta, recursos, parceiros, portal do parceiro e suporte apontam para rotas existentes no frontend do sistema principal.
- Os três botões de planos enviam `plan=basic`, `plan=essential` ou `plan=pro`; o cadastro do sistema reconhece esses identificadores.
- A versão integrada usa apenas o frontend do sistema principal na porta 3000; a landing está na rota `/`.
- A escolha de tema da landing fica salva no armazenamento do navegador. O sistema principal já salva a própria escolha de tema.
- A landing não recebe nem guarda senhas. Login e cadastro são feitos no sistema principal.

## Pendências antes de colocar no ar

1. Testar o fluxo completo do sistema principal com API e banco locais: cadastro, pagamento, login, recuperação de acesso, painel e logout. A existência das rotas não comprova esses fluxos.
2. Decidir se a opção de salvar credenciais será oferecida pelo gerenciador de senhas do navegador. No login do sistema principal, adicionar `autoComplete="username"` ao e-mail e `autoComplete="current-password"` à senha, e verificar o preenchimento real no navegador. Nunca salvar senha em `localStorage`.
3. Verificar a integração iFood em ambiente de teste com credenciais e loja autorizadas. No código do Worker, `IFOOD_ENABLED` está `false` e a lista de capacidades homologadas está vazia; ativação em produção ainda depende dessas etapas.
4. O domínio `mycardap.io` foi adquirido para a landing e o sistema principal na mesma origem. A marca e os metadados foram sincronizados com o projeto integrado; configurar DNS e testar todos os links no ambiente publicado. A navegação integrada usa rotas internas no teste local.
5. Concluir a revisão de privacidade, termos, cookies, metadados, imagem de compartilhamento e conteúdo comercial descrita em `docs/revisao-item-5.md`. A imagem e os metadados técnicos foram preparados; a identificação da empresa, os fluxos de dados e os termos comerciais ainda dependem de confirmação.
