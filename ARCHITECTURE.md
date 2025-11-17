# Outlight UGC Hub — Technical Blueprint

## 1. Product Pillars
- **Campaign OS** – multi-brand/multi-campaign structure with lifecycle tracking (briefing → creator sourcing → asset QC → performance/retention).
- **Creator CRM** – unified creator profiles (contact, handles, rates, availability, onboarding notes) with shortlist/bulk-triage tooling and manual add support.
- **Collaboration Co-pilot** – AI assisted brief + outreach generator with per-creator tone/style controls and message history.
- **Ops Integrations** – ingestion from XLSX rosters, Shopify fulfilment alignment, Meta Ads performance sync, media asset vault & metrics dashboarding.

## 2. Stack & Deployment
| Layer | Choice | Notes |
| --- | --- | --- |
| Frontend | Next.js 15 (App Router) + React Server Components | Delivers dashboard + modular workspaces. |
| UI | Tailwind, shadcn/ui, React Hook Form, TanStack Table | Fast table filtering, modals, steps flows. |
| State/Data | React Query (client) + server actions | Handles optimistic updates, background syncing. |
| Backend | Next.js Route Handlers (REST) + tRPC/internal SDK | API-first; supports automations + 3rd-party clients. |
| DB | Supabase Postgres via Prisma ORM | Connection via `DATABASE_URL`/`DIRECT_URL`. |
| Files | Supabase Storage (assets), edge functions for signing | Video uploads and generated briefs. |
| Messaging & AI | OpenAI Responses API (Assistants) | Streaming + retrieval-ready. |
| Auth | Supabase Auth (SSO-ready via Google) | Aligns with provided Google OAuth creds. |
| Infra | Vercel for web, Supabase for DB/storage, CRON jobs | Works with brand’s existing tooling. |

## 3. Core Modules
1. **Workspaces & Campaigns**
   - Workspace switcher (Outlight Support, Info Support) scoped via Supabase auth metadata.
   - Campaign table with filters (status, owner, start/end, budget).
   - Inline creation wizard attaches deliverables, product SKUs, KPIs.
2. **Creator Directory**
   - Table view for all creators hired across campaigns (global) + per-campaign filtered view.
   - Manual add modal (name, IG/TikTok handles, contact, price, ER, sample links).
   - Bulk shortlist toggle, bulk delete for non-shortlisted (soft delete w/ audit).
3. **Roster Ingestion**
   - XLSX parser (SheetJS) expecting provided column headers (but resilient to order/case).
   - Mapping UI to match columns → store import job + dedupe by profile URL.
   - Import pipeline writes creators + campaign associations; flagged “shortlisted” column drives default state.
4. **AI Brief Assistant**
   - Per-creator assistant config (tone, structure, CTA, product highlights).
   - Server action hits OpenAI with context (campaign brief, creator persona, last notes) → returns (a) brief summary, (b) outreach message.
   - Version history stored in `creator_briefs` table with approval status.
5. **Asset Library & Performance**
   - Upload component (Dropzone) pushes videos to Supabase Storage bucket; metadata row ties to creator deliverable.
   - Meta Ads connector (long-lived system user token stored in Vault) fetches ad insights keyed by `asset_meta_id`.
   - Performance dashboard with charts (Victory) showing ROAS, CPA per creator.
6. **Fulfilment & Tracking**
   - Shopify Admin API integration to link order numbers to creators; surfaces fulfilment + SeventeenTrack data for shipments.
   - Timeline view per creator showing sample shipped → received → content live.

## 4. Data Model (Prisma outline)
- `workspaces`: `id`, `name`, `gmail`, OAuth credentials reference, settings JSON.
- `users`: Supabase auth profiles with workspace membership + roles.
- `campaigns`: `id`, `workspace_id`, `name`, `brand`, `status`, `brief`, `start_at`, `end_at`, `meta_ad_account_id`, `product_sku`.
- `creators`: `id`, `workspace_id`, `name`, `platform`, `gender`, `profile_url`, `handle`, `followers`, `avg_er`, `avg_views`, `median_views`, `rate`, `notes`, `contact_email`, `instagram_url`, `tiktok_url`.
- `campaign_creators`: join table w/ `status`, `shortlisted`, `price`, `date_added`, `source` (manual/import), `deleted_at`.
- `creator_briefs`: `campaign_creator_id`, `tone_prefs`, `prompt_context`, `brief_markdown`, `message`, `created_by`, `approved_at`.
- `assets`: `campaign_creator_id`, `type`, `storage_path`, `thumb_url`, `meta_ad_id`, `uploaded_at`.
- `asset_metrics`: snapshot table with `platform`, `impressions`, `clicks`, `spend`, `orders`, `revenue`, `cpa`, `roas`, `synced_at`.
- `shopify_orders`: `campaign_creator_id`, `order_number`, `fulfillment_status`, `tracking_number`, `seventeentrack_status`, `last_synced_at`.
- `import_jobs`: `id`, `campaign_id`, `filename`, `status`, `summary_json`, `error_log`.
- `activity_logs`: auditable events for compliance.

## 5. API & Integration Surfaces
- **Meta Ads Sync Worker**: scheduled job calling `/meta/sync` route; uses stored system user tokens, attaches creative metrics to `assets`. Supports manual resync per creator.
- **Shopify Fulfilment**: webhook receiver for `orders/fulfilled` hitting `/api/shopify/fulfillment`, updates `shopify_orders`, then hits SeventeenTrack to refresh shipping progress.
- **AI Assistant**: `/api/creators/{id}/brief` route validates role (Creator Manager), dispatches OpenAI call with streaming support to UI.
- **Excel Import**: `/api/imports` uses server action; file stored temporarily, parsed via SheetJS, validated with Zod, results persisted, and job progress pushed via Pusher (or Supabase Realtime).

## 6. UX Highlights
- Dashboard home: KPIs (active campaigns, creators in production, assets awaiting QA, spend vs target).
- Campaign detail: tabs (Overview, Creators, Assets, Performance, Logistics).
- Creator detail: hero (avatar, tier, tags), timeline, AI brief area, metrics, conversation log.
- Bulk actions: selection toolbar with `Shortlist`, `Reject`, `Delete non-shortlisted`.
- Search/global command palette for quick navigation.

## 7. Security & Compliance
- Secrets kept in `.env.local` (local) + Vercel encrypted envs.
- Role-based access (Admin, Manager, Viewer) enforced in middleware + server actions.
- PII encrypted columns where required (contact emails via pgcrypto extension).
- Full audit log for imports, deletions, AI content approvals.

## 8. Phase 1 Delivery Scope
1. Ship foundational Next.js app + Prisma schema migrations.
2. Implement campaign + creator CRUD and manual entry.
3. Build XLSX import with shortlist/bulk-delete controls.
4. Integrate OpenAI-based brief generator w/ history.
5. Asset upload stub + placeholder cards for Meta/Shopify metrics (real connectors mocked via background jobs).

Future phases will harden external API integrations, add notification automations, and expand analytics.
