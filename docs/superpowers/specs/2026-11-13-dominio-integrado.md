# Domínio público integrado para cardap.io

## Contexto

A marca continua **cardap.io**. O domínio adquirido para landing, login e cadastro é **https://mycardap.io**. A versão integrada em `C:\CARDAPIO-ANFC\Anfc-Cardapios\frontend` contém as rotas reais do sistema; o export estático desta pasta serve apenas para prévia. O frontend integrado ainda não possui imagem social e seu layout não declara a origem pública.

## Requisitos e aceite

- A home integrada usa a marca cardap.io no texto e nos metadados, sem alterar o logo existente.
- Os links para `/login`, `/cadastro`, planos e suporte continuam relativos ao mesmo domínio.
- O HTML da home declara imagem social absoluta em `https://mycardap.io/og-cardapio.png`, com dimensões 1200 × 630 e texto alternativo.
- O ativo social está presente em `public/og-cardapio.png` do frontend integrado.
- A afirmação sobre iFood indica que a integração está em validação, sem sugerir disponibilidade imediata.
- Não são alterados autenticação, dados, cobrança, permissões ou APIs.

### Cenários

- **Dado** o frontend integrado, **quando** a home é renderizada, **então** os metadados sociais usam `mycardap.io` e a marca cardap.io.
- **Dado** o cadastro, **quando** o visitante aciona um plano, **então** a URL continua `/cadastro?plan=...` na mesma origem.
- **Dado** a FAQ sobre iFood, **quando** o visitante a lê, **então** encontra uma indicação explícita de validação pendente.
- **Dado** o ativo social, **quando** é inspecionado, **então** é PNG de 1200 × 630 pixels.

## Arquitetura e limites

Atualizar somente o bloco de metadados do layout integrado, textos da landing integrada e o ativo público. Manter os componentes, tipagens e contratos atuais. Não adicionar armazenamento, cookies ou integrações. A URL canônica de páginas individuais, DNS e publicação serão tratados após verificar o ambiente público; não definir uma canonical global que apontaria páginas do sistema para a home.

## Falhas e segurança

- Rejeitar sincronização se os arquivos integrados não tiverem os trechos esperados, evitando sobrescrever mudanças concorrentes.
- Preservar todas as alterações preexistentes no outro projeto.
- O domínio adquirido não comprova DNS, TLS ou deploy; verificar isso separadamente.

## Testes e execução

1. Executar uma verificação de leitura do frontend integrado e observar falhas esperadas para metadados, imagem e copy.
2. Preparar arquivos atualizados nesta pasta e revisar a diferença exata antes de solicitar escrita fora do workspace.
3. Aplicar a mudança somente após aprovação de acesso ao diretório integrado.
4. Reexecutar a verificação, o typecheck e os testes relevantes do frontend integrado.
