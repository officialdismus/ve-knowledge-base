# VE Knowledge Base

A modern, Airtable-backed knowledge base for Village Enterprise. The app balances a polished public experience with a lightweight admin surface: users find answers quickly, admins keep taxonomy healthy, and analytics close the loop.

---

## 🌟 Highlights

| Area | What’s Included |
| --- | --- |
| Public UX | Hero search (synonyms + fuzzy), role/content filters, category browsing, themed empty states. |
| Articles | Copy link, print, helpful voting, related resources, analytics tracker, print stylesheet. |
| Admin Toolkit | Taxonomy table with add/edit modals, Airtable CRUD routes, feedback intake, analytics. |
| Data & Telemetry | `/api/analytics/{view,search,helpful}` endpoints capturing usage + gaps. |
| Design System | CSS variable tokens, sticky header/footer, mobile-first layout, persisted filters via Zustand. |

---

## 🧱 Architecture

```text
Next.js App Router (React 19)
│
├─ Public routes        (/ , /search , /categories , /articles/[slug] , /feedback)
├─ Admin routes         (/admin/**)
├─ API routes           (/api/search , /api/filters , /api/analytics/* , /api/admin/*)
└─ Shared libraries     (Airtable client, stores, theme tokens)
```

* **Data Source:** Airtable tables for articles, categories, searches, feedback.
* **State:** Filters and role/content preferences stored via Zustand (`filtersStore`, `uiStore`).
* **Styling:** CSS variables in `theme.css`, utility classes, dedicated `print.css`.
* **Deployment:** Vercel build output (`npm run build`).

---

## 🚀 Getting Started

```bash
git clone https://github.com/officialdismus/ve-knowledge-base.git
cd ve-knowledge-base
npm install
```

Create `.env.local`:

```bash
AIRTABLE_BASE_ID=<your_base_id>
AIRTABLE_PAT=<your_pat>
AIRTABLE_TABLE_ARTICLES=Articles
AIRTABLE_TABLE_CATEGORIES=Categories
AIRTABLE_TABLE_SUBCATEGORIES=Subcategories
AIRTABLE_TABLE_SEARCHES=Searches
```

Run locally:

```bash
npm run dev
```

---

## 🧩 Feature Tour

### User Experience

1. **Home:** Search hero (autocomplete + synonyms), persistent filters, trending sections.

2. **Search Results:** Fetches live filter metadata from `/api/filters`, logs analytics, empty state CTA → feedback.

3. **Categories/Subcategories:** Filterable cards, clear empty states with “Request this article”.

4. **Articles:** Restyled layout, `ArticleAnalyticsTracker`, `ArticleQuickActions` (copy/print) to avoid hydration errors, related links.

5. **Feedback:** Prefilled context pills for search or article flows, thank-you screen with reference ID.

### Admin & System Routes

* `/admin/taxonomy` – client table + add/edit modal wired to Airtable POST/PATCH routes.

* `/api/search` – pulls Airtable data, scores with synonyms, returns metadata for filters.

* `/api/analytics/{search,view,helpful}` – records activity for insights.

---

## 🛠️ Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server. |
| `npm run lint` | ESLint (flat config + Next rules). |
| `npm run build` | Production build (used by Vercel). |
| `npm run start` | Run built app. |

> ✅ `npm run lint` and `npm run build` currently pass.

---

## 📂 Structure (condensed)

```text
src/
├─ app/                 # App Router routes (public + admin + API)
├─ components/          # Shared UI (search, article, admin, shell)
├─ lib/airtable/        # Airtable client + helpers
├─ state/               # Zustand stores
└─ styles/              # theme.css, print.css, globals
```

Key references:

* `src/app/search/page.tsx` – search UI + analytics logging.
* `src/app/articles/[slug]/page.tsx` – refreshed article template.
* `src/components/admin/CategoryModal.tsx` – add/edit form used in `/admin/taxonomy`.
* `src/lib/airtable/client.ts` – typed helpers for select/create/update.

---

## 🔐 Environment

| Variable | Description |
| --- | --- |
| `AIRTABLE_BASE_ID` | Base containing Articles/Categories/Searches tables. |
| `AIRTABLE_PAT` | Personal access token with read/write scope. |
| `AIRTABLE_TABLE_*` | Optional table name overrides. |

Configure the same values in Vercel → Project Settings → Environment Variables.

---

## ✅ Testing & QA

* `npm run lint`
* `npm run build`

Recommended manual checks:

1. Perform a search (with and without matches) and confirm analytics requests succeed.

2. Open an article, trigger helpful votes, copy link, print preview.

3. Add/edit a category via `/admin/taxonomy` and verify Airtable data updates.

---

## 🚢 Deployment

1. Push to `main`:

   ```bash
   git add .
   git commit -m "feat: …"
   git push origin main
   ```

2. Vercel CI/CD runs `npm run build` and deploys.

3. Monitor the deployment logs (look for Airtable errors or missing env vars).

Tips:

* Use Preview deployments for feature branches.
* Keep Airtable PAT scoped and rotated when needed.

---

## 🧭 Roadmap Ideas

1. In-app article editor (markdown or block editor) instead of Airtable-only edits.

2. Feedback triage board with statuses and assignments.

3. Search relevance tuning (Fuse.js weights or Algolia if dataset grows).

4. Authenticated admin area (NextAuth/Clerk) for managing taxonomy + feedback.

---

## 🤝 Contributing

1. Fork & clone this repo.

2. Create a descriptive branch (for example `feat/taxonomy-permissions`).

3. Run `npm run lint` and `npm run build` before pushing.

4. Open a PR with screenshots for UI changes.

---

## 📄 License

MIT © Village Enterprise / Dismus Mumanthi

---


