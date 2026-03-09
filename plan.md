# Development Plan for VE Knowledge Base

This document outlines the high-level plan and milestones required to implement the system described in the README.

## Progress update (2026-02-26)

Completed items:

- Added `airtableUpdate` helper in `lib/airtable/client.ts` to support PATCH updates.
- Implemented analytics endpoints:
  - `POST /api/analytics/view` — increments `Total Views` and updates `Last Viewed`.
  - `POST /api/analytics/helpful` — increments `Helpful Count` / `Not Helpful Count`.
  - `POST /api/analytics/search` — logs search queries (for zero-result tracking).
- Added client-side helpful UI and view increment:
  - `components/ArticleActions.tsx` — increments views on mount, helpful/not-helpful buttons.
  - Article page renders `ArticleActions` and passes initial counts.
- Added zero-result logging in `components/SearchBar.tsx` and a "Request topic" CTA linking to the homepage with `?requestTopic=...`.
- Debounce (300ms) already present in `SearchBar` (retained).

Remaining high-priority tasks:

1. Install and integrate `fuse.js` (or a hosted search provider) for improved fuzzy matching and synonym handling.
2. Pre-fill a feedback form from the homepage when `?requestTopic=` is present (no-results flow).
3. Add scheduled jobs to analyze search logs and surface intelligence signals (cron / platform scheduler).
4. Flesh out admin workflows: full article editor (draft→review→publish), taxonomy manager, feedback review UI.
5. Add tests and CI, and configure Vercel preview deployments.

---

Next action: integrate `fuse.js` and improve `/api/search` to use a richer fuzzy match; I can add the dependency and update the server search handler next if you want.
