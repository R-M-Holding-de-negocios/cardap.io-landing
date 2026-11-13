# Transição de tema com varredura de pixels

## Intenção

Adicionar à barra superior da landing page um botão simples para alternar entre os temas claro e escuro. Ao ativar o escuro, uma linha horizontal retangular de pixels desce do topo ao fim da área visível. Cada elemento da página troca gradualmente as cores de fundo, texto, borda e controles quando a linha chega à sua posição. A mesma ação retorna ao claro.

## Abordagens

- **Troca gradual por elemento (escolhida):** o tema escuro começa a valer e cada elemento anima suas cores com atraso calculado pela posição vertical na tela, sincronizado com a linha de pixels. Mantém a relação entre a linha e as cores, inclusive em textos e botões.
- **Troca por blocos:** alternar seções horizontais inteiras ao cruzar a linha. Mais simples, porém os elementos não acompanham a varredura com precisão.

## Interface e comportamento

- Desktop: botão discreto na barra superior.
- Celular: mesmo botão ao lado do controle de menu.
- A landing começa no tema claro, independente do tema global definido para outras áreas do produto.
- Clique alterna claro/escuro; a varredura é retangular, percorre o viewport de cima para baixo rapidamente e não usa máscara circular.
- O tema dos elementos visíveis muda conforme a linha os alcança. A troca inversa também deve funcionar.
- Respeitar `prefers-reduced-motion`: trocar o tema sem a varredura animada.
- Usar o sistema de cores já definido no CSS e o canvas/animação existente do PixelCard como referência visual, sem modificar o PixelCard dos planos.

## Limites

- Não alterar a aparência das páginas de produto fora da landing.
- Não persistir a escolha entre visitas nesta etapa.
- Manter funcionamento por teclado, rótulo acessível e foco visível.

## Verificação

- Conferir alinhamento e posição do botão em desktop e celular.
- Conferir troca gradual em fundos, títulos, parágrafos, links e botões, nos dois sentidos.
- Conferir movimento reduzido, teclado e ausência de mudança em outras áreas do produto.
