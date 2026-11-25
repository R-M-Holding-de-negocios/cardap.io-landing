# cardap.io — landing (guia para agentes)

Atualizado em 25/11/2026.

Esta pasta é o **site** do cardap.io, servido em `mycardap.io`: página inicial,
`/cadastro`, `/parceiros`, `/partner` (portal do afiliado) e `/admin` (admin da
plataforma). Essas telas existem só aqui. O sistema do restaurante fica em um
subdomínio, em outro repositório. Esta pasta não tem banco: tudo passa por proxy
para a API (`PLATFORM_API_URL`).

**O guia principal, o escopo, o roadmap e as tarefas ficam no repositório do SaaS:**

- `C:\CARDAPIO-ANFC\Anfc-Cardapios\CLAUDE.md`
- `C:\CARDAPIO-ANFC\Anfc-Cardapios\docs\ESCOPO.md`
- `C:\CARDAPIO-ANFC\Anfc-Cardapios\docs\ROADMAP.md`
- `C:\CARDAPIO-ANFC\Anfc-Cardapios\docs\TAREFAS.md` (tarefas desta pasta usam o prefixo `LANDING/`)

Leia o `CLAUDE.md` de lá antes de trabalhar aqui. As regras valem para as duas pastas.

## O que muda nesta pasta

- **Destino de publicação: VPS**, com `next start`, atrás de Cloudflare Tunnel. A
  Vercel deixa de ser usada (decisão do João em 25/11/2026).
- **Sem trial.** Afiliados ativos desde o lançamento. Plano Pro aparece como "em breve".
- **Segurança entre rotas é requisito.** Público, afiliado e admin são identidades
  separadas: cada proxy só encaminha os caminhos e o cookie da sua área; nenhum
  cookie com `Domain`; proteção de página sempre no servidor. Ver ESCOPO seção 4.6
  e tarefa F2-T7. Não afrouxar listas de caminhos nem conferência de origem.
- `.saas-work/` contém cópias antigas do SaaS, segredos e backups locais.
  **Não editar, não ler `secrets/` nem `backups/`, não commitar.** Será arquivada (tarefa F0-T6).
- Os textos de Termos, Privacidade e Cookies estão desatualizados e com
  `[PREENCHER]`. O conteúdo vem do João e do advogado; não redigir texto jurídico.

## Como rodar

```powershell
npm.cmd ci
Copy-Item .env.example .env.local   # só na primeira vez
npm.cmd run dev                     # http://localhost:3001
npm.cmd test
npm.cmd run typecheck
```

A API do SaaS precisa estar no ar em `http://localhost:8787` para cadastro, portal e admin.

## Antes de escrever código Next

Ler o guia correspondente em `node_modules/next/dist/docs/` (ver `AGENTS.md` desta pasta).
