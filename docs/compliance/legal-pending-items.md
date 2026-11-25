# Pendências jurídicas e operacionais antes da publicação — atualizado em 24/11/2026

Este documento foi iniciado quando a landing era apenas uma página de apresentação. Hoje a landing coleta dados para cadastro de restaurantes, candidatura de afiliados e autenticação dos portais. As páginas públicas de Termos, Privacidade e Cookies ainda descrevem o fluxo antigo; ver `AUDITORIA-LANDING-2026-11-23.md` e `REVISAO-VISUAL-2026-11-24.md`.

| Prioridade | Informação ou decisão necessária | Responsável sugerido | Efeito até resolução |
|---|---|---|---|
| **Alta** | Identificação completa do fornecedor/controlador: razão social ou nome, CPF/CNPJ quando aplicável, endereço e contato efetivo. | Proprietário + jurídico | Placeholders nas três páginas; não tratar os textos como versão final. |
| **Alta** | Canal operacional de privacidade, autenticação do solicitante, prazos internos e fluxo de acesso, correção, exclusão e informações sobre compartilhamento. | Proprietário + DPO/jurídico | O canal e o procedimento ainda não estão identificados nas páginas públicas. |
| **Alta** | Auditoria do SaaS principal: API, banco, autenticação, autorização por restaurante/função, pagamentos, recuperação de senha, sessões, logs, backups e terceiros. | Equipe do sistema principal | Vulnerabilidades críticas/altas nesses fluxos permanecem desconhecidas; não há atestado para eles. |
| **Alta** | Termos contratuais reais e aceite explícito no cadastro/contratação, com versão, instante, usuário e evidência da ação. Regras de preço, renovação, cancelamento e arrependimento. | Produto + jurídico + equipe SaaS | A landing não registra aceite genérico. Não ativar contratação pública sem revisão do fluxo. |
| **Alta** | Revisar a candidatura de afiliados recebida pela landing e sua política de dados, chave Pix, regras de comissão e mensagem pública. A falha do formulário antigo do SaaS deve ser tratada como histórico e reavaliada apenas se aquela rota continuar acessível. | Produto + equipe SaaS + jurídico | A página de parceiros e os termos ainda precisam corresponder ao fluxo e às regras atuais. |
| **Média** | Provedor de hospedagem, cookies do host/CDN, logs/IP, prazos, suboperadores, países e transferências internacionais. | Infraestrutura + privacidade | Política descreve apenas o observado no repositório. |
| **Média** | TLS, redirecionamento HTTPS, cabeçalhos, CSP, HSTS adequado, segredos, permissões mínimas, backup e restauração no ambiente real. | Infraestrutura | Não verificado no site publicado. |
| **Média** | Plano de resposta a incidentes, responsáveis, registros e comunicações regulatórias. | Segurança + jurídico | Sem procedimento operacional comprovado. |
| **Média** | Avaliar tratamento de dados de crianças/adolescentes, caso o cardápio real permita perfis ou dados de menores. | Produto + jurídico | Enquadramento ainda desconhecido. |
| **Média** | Revisão jurídica das bases legais, retenções e textos finais da landing e do SaaS, inclusive CDC e Decreto 7.962/2013. | Jurídico | As páginas atuais são informativas e possuem campos pendentes. |
| **Baixa** | Auditoria de acessibilidade integral, incluindo leitor de tela e todos os fluxos do SaaS. | Produto + acessibilidade | Só o aviso teve teste automático básico de teclado e viewport. |

## Portas de publicação

Para a publicação, configurar `NEXT_PUBLIC_SITE_URL` com a origem HTTPS real, `NEXT_PUBLIC_SAAS_URL` com a origem HTTPS do SaaS e `PLATFORM_API_URL` com a API de **produção**. Conferir banco, credenciais e webhook separados do sandbox. O código exige HTTPS, mas não distingue uma URL HTTPS de homologação de uma de produção. Confirmar dados empresariais, canais, cookies de sessão e termos antes de abrir o cadastro ao público. O checklist atualizado está em `docs/pre-publicacao.md`.
