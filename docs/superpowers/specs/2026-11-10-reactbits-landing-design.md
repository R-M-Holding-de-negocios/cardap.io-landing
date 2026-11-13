# React Bits na landing do Cardapio.io

**Data:** 2026-11-10
**Status:** Direção visual aprovada; implementação revisada após o feedback do usuário.

## Intenção

Integrar sete componentes React Bits à landing existente e reforçar a direção editorial gastronômica escolhida, preservando a paleta creme e laranja, o conteúdo aprovado e os fluxos atuais.

## Objetivos

- Mostrar a marca e o produto com mais ritmo visual, usando imagem gastronômica e prévias reais do sistema.
- Integrar os componentes PixelCard, SwipeToast, ScrollExpand, TextLoop, StaggeredMenu, ScrollReveal e RotatingText em áreas onde cada um tenha uma função clara.
- Manter experiência acessível, responsiva e respeitosa a `prefers-reduced-motion`.

## Fora de escopo

- Reescrever conteúdo, mudar preços ou recursos de plano.
- Alterar rotas, destino dos CTAs, formulários ou integrações do SaaS.
- Publicar, fazer deploy ou adicionar imagens remotas.

## Abordagens consideradas

1. **Editorial gastronômico (escolhida):** usar mídia gastronômica local e compor as seções em torno dela, intercalando com a prévia e a demonstração do produto. É a direção escolhida pelo usuário.
2. **Produto em primeiro plano:** hero dividido com prévia do painel logo à direita; mantém mais foco imediato no SaaS, mas não segue a direção editorial escolhida.
3. **Grade de funcionalidades:** cartões compactos para apresentar muitos recursos; descartada por potencial de densidade visual e repetição dos cartões atuais.

## Distribuição dos componentes

- **ScrollExpand:** interlúdio editorial com a ilustração local `/images/landing/menu-aberto.png` em uma moldura creme, expandindo ao rolar; não substituirá a prévia real do produto.
- **RotatingText:** trecho curto da abertura alternando “cardápio digital”, “pedidos na mesa” e “atendimento do salão”, com texto acessível para leitores de tela.
- **ScrollReveal:** revelar alguns títulos de seção ao entrar na tela; não aplicar a todo o texto.
- **TextLoop:** uma faixa estreita e animada entre seções com categorias do produto; manter legível e sem movimento quando redução de movimento estiver ativa.
- **PixelCard:** efeito de entrada e interação por hover/foco em um único cartão do plano Pro, com contraste suficiente para preservar leitura e foco por teclado.
- **SwipeToast:** mostrar “Demonstração concluída” ao terminar o fluxo do simulador; texto deve deixar claro que a ação foi simulada.
- **StaggeredMenu:** substituir o menu móvel atual; manter a navegação desktop e os destinos atuais.

## Restrições e decisões técnicas

- Seguir o stack atual: Next.js App Router, React 19, TypeScript e CSS/Tailwind existentes.
- Os componentes das instruções JavaScript permanecem em JSX para preservar a fonte React Bits sem uma conversão mecânica extensa; o projeto já permite JavaScript com `allowJs`. Os estilos serão ajustados à paleta atual.
- GSAP e Motion não constam atualmente no `package.json`; instalar apenas as dependências usadas. Usar `lucide-react` já instalado para o ícone de fechar do toast, evitando uma dependência de ícones adicional.
- Usar apenas imagens locais existentes; preferir a imagem real de prato disponível e preservar os assets atuais.
- Manter navegação, CTAs, simulador, links de produto e texto dos planos inalterados.
- Evitar animações concorrentes no mesmo elemento, limitar efeitos contínuos e respeitar redução de movimento.

## Critérios de aceitação

- Os sete componentes estão integrados nas posições acima e combinam com o visual existente.
- O menu móvel mantém links, fechamento e estado acessível; a navegação desktop continua presente.
- ScrollExpand e efeitos de entrada têm comportamento utilizável em telas pequenas e com movimento reduzido.
- A demonstração gera um toast identificado como simulação; nenhum texto sugere envio de pedido real.
- Preços, copy, formulários, navegação e demais interações existentes permanecem preservados.

## Resolução da revisão técnica

- A faixa editorial usará o asset local `/images/landing/menu-aberto.png` para representar diferentes tipos de restaurante, evitando a foto de hambúrguer como foco visual dominante.
- `RotatingText` substituirá somente o texto fixo da etiqueta da abertura por “Cardápio digital”, “Pedidos na mesa” e “Atendimento do salão”. Título e parágrafo atuais permanecem intactos; a animação não será anunciada continuamente por leitores de tela.
- A revisão independente não encontrou outras perguntas que impeçam o planejamento.

## Direção de ilustração revisada pelo usuário

- O visual editorial gastronômico terá aparência desenhada à mão, com traços orgânicos e detalhe médio.
- Usar as ilustrações locais (principalmente `/images/landing/menu-aberto.png` e `/images/landing/prato-talheres.png`) como referência visual para a seção ScrollExpand e elementos decorativos.
- Priorizar formas grandes e focos claros; evitar fotografia, microtexturas, hachuras densas, linhas muito finas e ornamentos minúsculos que percam legibilidade.
- Manter a paleta creme, laranja e carvão. As prévias reais do software ficam nítidas e sem tratamento de ilustração.
- Não criar nem baixar novos assets nesta etapa.

## Revisão após feedback do usuário

- A abertura editorial passa a usar uma composição lateral com as ilustrações locais de prato e bebida; a prévia real do produto aparece apenas uma vez, na seção do sistema.
- As áreas de pedidos, fila, tempo de gestão, recursos de operação, iFood e parceiros foram reagrupadas para evitar repetir o mesmo fluxo em vários blocos.
- O TextLoop fica limitado a uma faixa compacta; o ScrollExpand usa o menu ilustrado em um fundo creme para manter o traço desenhado sem um bloco escuro.
- O texto do RotatingText continua trocando de frase com transições reduzidas quando essa preferência está ativa. ScrollExpand e ScrollReveal ficam estáticos sob redução de movimento.
- O aviso do simulador aparece em fluxo abaixo da demonstração, sem cobrir título ou controles.
