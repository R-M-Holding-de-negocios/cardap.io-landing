# cardap.io — landing page

Projeto independente da landing de cardap.io.

- URL planejada: https://www.cardap.io
- Aplicação SaaS: https://cardap.io
- Stack: Next.js estático; o build gera `out/` para Cloudflare Pages.

## Desenvolvimento

```powershell
npm.cmd install
npm.cmd run dev
```

## Build estático

```powershell
npm.cmd run build
```

Configure Cloudflare Pages para executar `npm run build` e publicar `out/`. O domínio, repositório remoto e DNS ainda precisam ser conectados no Cloudflare.
