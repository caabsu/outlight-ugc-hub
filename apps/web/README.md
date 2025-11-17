# Outlight UGC Hub

An internal command center for Outlight to source, brief, and optimize UGC creator collaborations. Built with Next.js 16 (App Router), Prisma, Supabase Postgres, OpenAI, Shopify, and Meta Ads connectors.

## Features

- **Campaign OS** – create multi-brand campaigns, control status and budgets, and attach deliverables.
- **Creator CRM** – shortlist, bulk-triage, manually add creators, and view all hired creators across campaigns.
- **Excel ingestion** – upload BrandOutlight formatted spreadsheets to auto-create creators and assignments.
- **AI brief assistant** – build context-rich briefs and outreach emails with OpenAI, stored per creator.
- **Asset & performance hub** – upload content to Supabase Storage, sync Meta Ads insights, and analyze ROAS.
- **Logistics** – link Shopify orders, pull tracking data via SeventeenTrack, and surface fulfilment status.

## Getting started

```bash
cd apps/web
npm install
cp .env.example .env # fill with provided secrets
npm run db:generate   # optional if schema changes
npm run dev
```

Visit `http://localhost:3000`.

## Environment variables

See `.env.example` for the full list: database URLs, Supabase keys, OpenAI key, Google OAuth config, Shopify tokens, SeventeenTrack key, and workspace metadata.

## Database & Prisma

Schema lives in `prisma/schema.prisma`. Use Supabase Postgres via:

```bash
npm run db:push      # apply schema to remote DB
npm run db:generate  # regenerate Prisma client
```

## Project structure

- `src/app` – App Router routes, grouped dashboards (`(dashboard)`) and API routes.
- `src/components` – UI primitives, dashboard widgets, campaign/creator forms.
- `src/server` – Server actions + services (Prisma queries, integrations, AI helpers).
- `src/lib` – Env validation, Prisma client, Supabase, Shopify, Meta, OpenAI utilities.
- `src/data` – Static constants and sample data for empty states.

## Integrations

- **Meta Ads**: Provide `META_SYSTEM_USER_TOKEN` + `META_AD_ACCOUNT_ID` to start syncing creative insights.
- **Shopify**: Use Admin API token (`SHOPIFY_ADMIN_ACCESS_TOKEN`) and domain to pull order + fulfilment info.
- **OpenAI**: Set `OPENAI_API_KEY` to power the brief assistant and `/api/brief` route.
- **SeventeenTrack**: optional for live tracking statuses.

## Next steps

- Add Supabase Auth + Google SSO for workspace switching.
- Build scheduler jobs (Vercel Cron or Supabase Functions) for Meta + Shopify syncs.
- Expand notification system (Slack + Gmail drafts) based on workflow events.
