# Verificação antes da publicação — 24/11/2026

Este checklist substitui a versão de 13/11, que descrevia uma landing apenas estática. Agora cadastro, candidatura de afiliado e portais de admin/afiliado estão nesta aplicação; o SaaS do restaurante permanece separado.

## Já conferido

- Preview de homologação com navegação pública, cadastro, entrada de afiliado e administração.
- Em rodada autenticada anterior, admin e afiliado entraram e as seções principais abriram; duas indicações fictícias e cobranças Pix sandbox geraram as comissões esperadas. Ver `portais-landing-status.md`.
- Em 24/11, páginas públicas foram revistas em desktop e celular: textos e cartões visíveis, sem rolagem horizontal indevida. Ver `REVISAO-VISUAL-2026-11-24.md`.
- Testes da landing: 40/40 aprovados; tipagem aprovada após remover tipos gerados antigos.

## Falta antes de abrir o cadastro ao público

1. Atualizar Termos, Privacidade e Cookies conforme os formulários e sessões atuais; preencher responsável, contato, fornecedores, retenção, condições de contratação e mecanismo de aceite. Ver `compliance/legal-pending-items.md`.
2. Publicar no Preview o campo CPF/CNPJ local e testar um cadastro novo até a criação da primeira cobrança; conferir também mensagens de erro e indicação.
3. Sincronizar no repositório principal do SaaS a correção Asaas já publicada no Worker de homologação, para evitar regressão em deploy futuro.
4. Testar no sandbox cancelamento dentro dos sete dias, anulação da comissão, maturação, elegibilidade e fila de repasses; não enviar Pix para conta fictícia.
5. Conferir novamente as telas autenticadas de admin e afiliado em desktop e celular após o próximo deploy, inclusive tabelas, modais e estados vazios.
6. Suavizar a animação transitória do menu móvel e verificar a troca de tema em aparelho real e com movimento reduzido.
7. Confirmar cabeçalhos de segurança, domínio, links, metadados, imagem de compartilhamento e funcionamento no ambiente publicado.
8. Preparar e verificar API, banco, credenciais, webhook e variáveis de **produção** separados da homologação antes de apontar `mycardap.io` para a nova versão.
9. Remover o Worker temporário de diagnóstico Asaas após conferir que não é mais necessário; ver `portais-landing-status.md`.

## Outros recursos

A integração iFood permanece em validação; a landing já informa essa limitação. O funcionamento completo do SaaS, recuperação de acesso e operação real exigem validação própria no projeto principal. A auditoria técnica está em `AUDITORIA-CARDAPIO-ANFC-2026-11-23.md`.
