# Relatório final da etapa local — 14/11/2026

> Registro histórico da etapa local de 14/11. Não descreve o estado atual dos portais e do cadastro na landing. Para o estado atual, consultar `../portais-landing-status.md`, `../REVISAO-VISUAL-2026-11-24.md` e `../pre-publicacao.md`.

## Resultado

A auditoria e as correções cobrem **a landing estática deste repositório**. A leitura pontual do sistema principal não substitui auditoria integral de suas APIs, banco, autenticação e pagamento. O deploy não foi verificado. Não há declaração de regularidade integral.

Uma leitura pontual do repositório principal identificou dois bloqueios altos: cadastro sem evidência de aceite contratual e candidatura de parceiros com sucesso sem persistência. Esse era o estado inicial; veja a atualização de 14/11/2026 abaixo. Não foi feita auditoria exaustiva do SaaS.

| Etapa | Evidência e resultado | Risco residual |
|---|---|---|
| Diagnóstico | `docs/security/initial-audit.md`: arquitetura, fluxos, dados e limites | Sistema principal fora do workspace |
| Segurança | `vulnerabilities.md` e `security-fixes.md`: dependências vulneráveis removidas/atualizadas; guarda de build público | Cabeçalhos e controles do SaaS dependem do deploy e de auditoria separada |
| Privacidade | Preferências versionadas, três escolhas, personalização sem marcação prévia, revogação no rodapé | Não há scripts opcionais hoje; integrações futuras exigem gate de carregamento |
| Documentos | `/termos-de-uso`, `/politica-de-privacidade`, `/politica-de-cookies` exportadas e ligadas no rodapé | Campos empresariais, comerciais e operacionais pendentes; revisão jurídica necessária |
| Validação | `npm test`: 30 testes; `npm run typecheck`: sem erros; `npm run build`: 9 rotas exportadas; Playwright: 3 testes; `npm audit`: 0 alertas | Testes de auth/API/banco e HTTPS publicado não são possíveis neste repositório |

Os testes de navegador foram executados no export servido localmente por `scripts/serve-export.cjs`. Não foram realizados testes destrutivos ou de produção. A configuração de build público foi testada por unidade; a prévia isolada continua intencionalmente usando localhost quando não há origem pública configurada.

## Informações para o proprietário

Fornecer identificação empresarial, CNPJ/CPF e endereço quando aplicável, canal efetivo de privacidade e suporte, provedor de hospedagem, lista de terceiros e países, prazos de retenção, condições reais de contratação/pagamento/cancelamento e acesso ao projeto principal para auditoria completa. Ver lista priorizada em `legal-pending-items.md`.

## Atualização do SaaS principal — 14/11/2026

A candidatura de parceiro passou a ser persistida, com estado pendente. Foi criado acesso separado para afiliados, painel com dados reais, código de indicação validado no cadastro e lançamentos de comissão vinculados a pagamentos recebidos. A opção explícita de manter o login por 30 dias também foi implementada. A migração D1 é aditiva e **não foi aplicada em produção**. O aceite contratual do cadastro segue pendente. Códigos promocionais dependem de regras comerciais confirmadas e não são aplicados à cobrança. Detalhes e testes estão em `C:\CARDAPIO-ANFC\Anfc-Cardapios\docs\affiliates\implementation-status.md`.
