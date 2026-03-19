## AionView (Next.js 15 + TypeScript + PostgreSQL + Prisma)

Plataforma de gestão operacional, auditoria e governança para a Engenharia Clínica.

### Stack
- Next.js 15 (App Router)
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS (base) + shadcn/ui (estrutura pronta)
- Recharts
- Auth.js / NextAuth (Auth com `Credentials`)
- Integração PBI: somente backend
- Sincronização periódica: `POST /api/sync/pbi`
- PWA (manifest + service worker)

## Pré-requisitos
- Node.js 20+
- PostgreSQL

## Configuração
1. Copie `.env.example` para `.env.local`:
   - `cp .env.example .env.local`
2. Ajuste as variáveis:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` (ou `AUTH_SECRET`) e `NEXTAUTH_URL`
   - `PBI_BASE_URL`, `PBI_API_KEY` (fallback)
   - `API_PBI_*` por endpoint (prioridade sobre `PBI_API_KEY`)
   - `CRON_SECRET`
   - `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO` (automações de e-mail)
   - `SEED_*` (admin e escopos mínimos)

## Instalação
```bash
npm install
```

## Prisma
### Gerar client
```bash
npm run prisma:generate
```

### Migrações e seed
> Este repositório ainda não inclui migrations geradas até o momento.
> Ao estabilizar a modelagem final, gere migrations e aplique:
```bash
npm run db:migrate:dev
npm run db:seed
```

## Execução local
```bash
npm run dev
```

Acesse:
- `/login`
- `/dashboard`

## PWA (uso em celular)
- O app expõe `manifest.webmanifest` e `service worker` (`/sw.js`).
- Em navegadores mobile, você pode usar via web normalmente e também "Adicionar à tela inicial".
- Para refletir mudanças de versão de cache, incremente a constante `CACHE_NAME` em `public/sw.js`.

## Sincronização PBI (a cada 10 minutos)
Integrações externas ocorrem **apenas no backend** e o token não é exposto no frontend.

As chaves de integração podem ser configuradas de duas formas:
- por endpoint (`API_PBI_REL_CRONO_MANU`, `API_PBI_TIP_MANU`, etc.) **[prioridade]**
- fallback global (`PBI_API_KEY`)

Rota interna:
- `POST /api/sync/pbi`

Autorização:
- envie header `x-cron-secret: <CRON_SECRET>`

Exemplo:
```bash
curl -X POST http://localhost:3000/api/sync/pbi \
  -H "x-cron-secret: $CRON_SECRET"
```

Pipeline (incremental, base já implementada):
1. Cria `sync_runs`
2. Chama todos os endpoints PBI definidos
3. Persiste payload bruto em `raw_api_payloads` (Json por endpoint e por syncRun)
4. Finaliza `sync_run` com status `success` ou `error` (tolerante a falhas por endpoint)

## Deploy no Railway (um único serviço/container)
1. Configure no Railway as variáveis:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` (ou `AUTH_SECRET`), `NEXTAUTH_URL`
   - `PBI_BASE_URL`, `PBI_API_KEY`
   - `CRON_SECRET`
   - `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`
   - `SEED_*`
2. Use o `Dockerfile` para buildar o container.
3. Crie um “Scheduled Job” para disparar a sincronização a cada 10 minutos:
   - URL: `https://SEU_DOMINIO/api/sync/pbi`
   - Header: `x-cron-secret`

Observação: o container roda bootstrap Prisma no startup (`db push` + `db seed`) quando `DATABASE_URL` está definido.
Isso facilita o primeiro deploy e garante criação de tabelas automaticamente.

## Rotas internas (base)
- `GET /api/health`
- `POST /api/sync/pbi`
- `POST /api/auth/*` (NextAuth)
- `POST /api/admin/bootstrap` (bootstrap manual de admin, protegido por `x-cron-secret`)
