# Revisão visual da landing — 24/11/2026

## O que foi conferido

Preview Vercel `https://cardap-io-landing-ayq25imt3-rj-6821.vercel.app`, em 1280 px e 390 px: página inicial, cadastro, programa de afiliados, entrada e recuperação do afiliado, entrada do administrador, login de restaurante, Termos, Privacidade e Cookies. Também foram conferidos os saltos para Como funciona, Sistema e Planos, a abertura do menu móvel, a troca de tema e a página inicial durante a rolagem. Foram observados textos, largura horizontal, elementos visíveis e capturas de tela.

## Resultado

- **O defeito anterior de cartões vazios e textos invisíveis não foi reproduzido** nas páginas públicas revisadas. Não houve rolagem horizontal indevida em 390 px ou 1280 px. Os saltos para seções posicionaram o conteúdo abaixo do cabeçalho fixo.
- **Animação do menu móvel:** durante a abertura, a captura mostrou por um instante um painel quase vazio e partes de letras cortadas. Após a transição, o menu ficou completo e legível. É um artefato transitório da animação que merece suavização; não ficou uma sobreposição permanente.
- **Troca de tema:** concluiu em tema escuro e a página voltou a ficar legível após a transição. A captura feita durante o efeito mostrou a máscara cobrindo parte do conteúdo por um instante; verificar se a duração e a máscara são agradáveis em aparelhos mais lentos.
- **Cadastro publicado:** o formulário abriu e ficou legível no celular, mas ainda não contém o campo CPF/CNPJ presente no código local. A publicação e o teste de cobrança inicial continuam pendentes.
- **Administração:** `/admin/restaurants`, `/admin/affiliates`, `/admin/payouts`, `/admin/support` e `/admin/audit` redirecionaram ao login, como esperado sem sessão. As telas internas não foram reavaliadas visualmente nesta rodada. A checagem autenticada anterior está registrada em `portais-landing-status.md`.
- **Afiliado:** a página pública e o formulário de login foram inspecionados. O painel de dados após autenticação não foi reavaliado nesta rodada. A rota correta do portal é `/partner/login`; `/partner` retorna 404 e não aparece como destino nos links principais observados.

## Testes locais

- `npm test -- --run`: 40/40 passaram.
- `npm run typecheck`: falhou inicialmente porque `.next/dev/types` continha rotas geradas em 22/11 incompatíveis com `.next/types` de 23/11. A pasta gerada antiga foi removida; a segunda execução passou. Nenhum arquivo de código fonte foi alterado para isso.

## Próximos passos visuais

1. Suavizar a abertura do menu móvel e verificar a máscara de troca de tema em aparelho real, especialmente com movimento reduzido.
2. Depois de publicar o campo CPF/CNPJ no Preview, rever cadastro e mensagens de erro em desktop e celular.
3. Entrar novamente nos painéis de administrador e afiliado após o próximo deploy e inspecionar cartões, tabelas, modais e estados vazios nas duas larguras.

Este documento complementa `AUDITORIA-LANDING-2026-11-23.md`; não substitui a auditoria de funcionamento ou os testes de cobrança e repasse.
