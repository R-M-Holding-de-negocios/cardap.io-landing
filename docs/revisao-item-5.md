# Revisão pré-publicação: privacidade, termos e conteúdo

## Escopo verificado

Esta revisão cobre a landing em `C:\CARDAPIO-LANDING` e uma leitura das páginas de cadastro e login do frontend principal. Ela não substitui a validação dos serviços, da hospedagem e dos contratos com fornecedores.

### O que o código mostra

- A landing guarda a escolha de tema em `localStorage` sob a chave `cardapio-theme`. Não foram encontrados scripts de analytics, anúncios ou cookies definidos pelo código da landing.
- O sistema principal usa cookies de sessão para autenticação. O formulário de cadastro pede estabelecimento, nome do responsável, e-mail, WhatsApp, senha, plano e forma de pagamento.
- Não foram encontradas rotas públicas de política de privacidade, termos de uso ou política de cookies no frontend principal nem nesta landing.
- Os preços e recursos dos planos Básico, Essencial e Pro da landing correspondem à tabela `BILLING_PLANS` do cadastro do sistema principal em 13/11/2026: R$ 59, R$ 79 e R$ 149 por mês.
- A comunicação sobre iFood foi ajustada para informar que a integração está em validação. Sua disponibilidade ainda precisa ser confirmada antes de qualquer oferta de ativação.

### Preparado nesta landing

- Título, descrição, idioma e apresentação para compartilhamento em redes sociais.
- Imagem social `public/og-cardapio.png` com 1200 × 630 pixels.
- `NEXT_PUBLIC_SITE_URL` controla as URLs absolutas da imagem social. Enquanto não estiver definido, a exportação fica com `noindex` e sem URL de imagem social.
- As páginas de passagem `/login` e `/cadastro` recebem `noindex`; o cadastro e o login efetivos pertencem ao sistema principal.
- O frontend principal possui um `src/app/layout.tsx` próprio. A imagem e os metadados de `mycardap.io` foram sincronizados com ele em 13/11/2026; o build integrado confirmou as tags Open Graph e Twitter.

### Validação do frontend integrado

- A verificação de domínio, marca, links relativos, texto sobre iFood e imagem social passou após a sincronização.
- A checagem de tipos e o build Next.js passaram. O HTML gerado contém `https://mycardap.io/og-cardapio.png` em Open Graph e Twitter.
- Os testes focados em navegação pública, fluxo público e planos passaram (7/7).
- A suíte completa terminou com 383 testes aprovados e 4 falhas em testes de conta e logo que verificam arquivos não alterados por esta sincronização. Essas falhas precisam de tratamento próprio antes da publicação.
- DNS, TLS, deploy e prévia social no domínio público ainda não foram testados.

## Informações necessárias para os textos públicos

1. Identidade da empresa responsável: razão social, CNPJ, endereço e canal de contato para privacidade.
2. Mapa de dados: quais dados são coletados de restaurantes, equipe e clientes finais, para quais finalidades, por quanto tempo e como são eliminados.
3. Fornecedores e compartilhamentos: hospedagem, banco, e-mail, pagamento, suporte, analytics e eventuais transferências internacionais.
4. Direitos dos titulares: canal e procedimento para acesso, correção, exclusão e demais solicitações.
5. Cookies e tecnologias similares usados no ambiente publicado, inclusive os que podem ser adicionados pela hospedagem ou por terceiros. Confirmar antes de redigir uma declaração definitiva ou adicionar banner de consentimento.
6. Condições comerciais: início da cobrança, renovação, cancelamento, reembolso, eventual período de teste, impostos e disponibilidade de recursos. Conferir em especial a mensagem de cobrança recorrente para Pix e boleto no cadastro do sistema principal.
7. A marca permanece cardap.io. A URL pública escolhida é `https://mycardap.io`, com a landing, login e cadastro no mesmo projeto integrado. Configurar DNS e testar a prévia de compartilhamento no ambiente publicado.

Não publicar políticas com dados inventados ou promessas de retenção, segurança, cancelamento e reembolso ainda não verificadas. A redação final precisa refletir a operação real e ser revisada pela pessoa responsável pela empresa.

## Referências consultadas

- [ANPD — Guia orientativo sobre cookies e proteção de dados pessoais](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais): orientações sobre transparência, política de cookies e controles quando houver cookies não necessários.
- [ANPD — Aviso de Privacidade](https://www.gov.br/anpd/pt-br/acesso-a-informacao/aviso-de-privacidade): exemplo de estrutura pública para explicar tratamento, retenção e direitos.
