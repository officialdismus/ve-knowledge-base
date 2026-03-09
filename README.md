# **VE Knowledge Base — Complete System**

## **Table of Contents**

1. Executive Summary
2. System Architecture & Loop
3. Global UI Shell
   3.1 Header (Persistent, Context‑Aware, **No Search Except Home**)
   3.2 Footer (Consistent, Informational)
4. User‑Facing System
   4.1 Home / Landing Page (Primary Search)
   4.2 Category Page
   4.3 Subcategory Page
   4.4 Article Page (Core) — **Copy Link & Print**
   4.5 Search Results — **No‑Results CTA → Prefilled Submission**
   4.6 Feedback Submission — **Prefill Rules**
   4.7 User Journeys
5. Admin System
   5.1 Admin Login & Roles
   5.2 Admin Dashboard
   5.3 Category Management
   5.4 Subcategory Management
   5.5 Article Management & Workflow
   5.6 Feedback & Review Queue
   5.7 User & Role Management
   5.8 System Settings
   5.9 Admin Journeys
6. Feedback & Intelligence Layer
7. Analytics & Data
8. Color & Theme Strategy (Consistent Across All Pages/Sites)
9. Accessibility, Performance & Mobile Responsiveness
10. Technology Stack & DevOps (**Simple Structure, No Monorepo**)
11. Success Metrics
12. Appendix
    A. Article Template (Markdown)
    B. Content Types—Definitions
    C. Role Permissions Matrix
    D. Workflow States
    E. Conceptual Diagram (ASCII)
    F. Feature Structure Notes (Routing, State, Components)
    G. Print Styles (Starter CSS)

## **1) Executive Summary**

The VE Knowledge Base is a **two‑sided platform**:

* **User‑Facing System:** Structured discovery and actionable content with strong feedback loops.
* **Admin System:** Governance via structured authoring, workflows, analytics, and feedback processing.

**Closed‑Loop Model:** Users discover → read → solve → submit feedback → admins update → system improves.
**UI Shell:** **Persistent Header & Footer** unify navigation, with an **intelligent Header** and **search only on Home**.
**Experience:** **Mobile‑first**, fast, accessible, and consistent in theme.

## **2) System Architecture & Loop**

1. **Admin creates/updates content** with metadata (category, subcategory, tags, audience, content type).
2. **Users discover** via **Home search** (only place with search), category browsing, role & content type filters.
3. **Users resolve** via clear, step‑by‑step articles with troubleshooting and related links.
4. **Users submit feedback** (helpful?, suggest improvement, report outdated).
5. **Feedback** enters **Admin Review Queue** → edits → publish → **Last Updated** refreshes.
6. **Analytics** inform gaps, freshness, priorities.

**Flow:** User → Feedback → Admin → Update → User (continuous improvement).

## **3) Global UI Shell**

### **3.1 Header (Persistent, Context‑Aware, No Search Except Home)**

**Purpose:** Provide brand presence, navigation, and page‑appropriate actions—**without clutter**.

**Always Present**

* **Logo/Brand** (click → Home)
* **Primary Nav**: Home, Categories, Popular/Trending, Feedback
* **Context‑Aware Right‑Side Actions** (vary by page):
  * **Article page**: **Copy Link**, **Print**, "Was this helpful?", "Report outdated"
  * **Search results**: "Request article" (no‑results case)
  * **Admin pages**: role‑based quick actions (Add Article, Review Feedback)
* **Search Visibility Rule:**
  * **Home Page:** search bar is **prominent** (hero search).
  * **All other pages:** **no search** in Header.

**Behavior**

* **Sticky** on scroll (with compact mode after scroll to save space).
* **Context Intelligence:** highlights current section, shows role filter badge when active, adjusts contrast over banners.

**Mobile**

* Hamburger menu for nav, compact sticky Header, large tap targets.
* Article action bar appears under the Header (see §4.4).

### **3.2 Footer (Consistent, Informational)**

**Contents**

* © VE {year}
* Links: About, Accessibility, Privacy, Terms, Contact Support
* **Feedback entry:** "Suggest an improvement" → Feedback Submission (with `source=footer`)
* Neutral, high‑contrast styling (Beige/White background, Dark text).

## **4) User‑Facing System**

### **4.1 Home / Landing Page (Primary Search)**

**Purpose:** The central problem‑solving gateway.

**Core Features**

* **Global Search (only here)**
  * Autocomplete, keyword match, tag recognition, synonym handling
  * Fuzzy matching (typos), ranked relevance, debounce, keyboard navigation
  * Target **\< 300ms** perceived response where possible
* **Browse by Category** → Subcategories → Articles (breadcrumbs, hierarchy)
* **Browse by Role** (filter layer; persists, easy to clear)
* **Content Type Filters**: Guide / Quick Fix / Policy / Checklist / FAQ (with definitions)
* **Dynamic Sections**: Most Viewed, Recently Updated, **Trending (7 days)**, Category‑popular
* **Edge Case (no search results on Home):** show **clickable CTA** → **Prefilled Submission Page** (see §4.6)

**Mobile:** Search expands to full width, collapsible category panels, stacked cards.

### **4.2 Category Page**

**Shows**

* Subcategories (e.g., Windows, Google Workspace, Security)
* Filters: Role, Content Type, Tags
* Article list \+ breadcrumbs

**Features**

* Sort: Popular / Recently Updated / Alphabetical / Relevance
* Tag filtering
* **Performance:** lazy loading, accessible pagination/"Load more", caching
* **UX:** filters persist, clear empty state with **"Request content"** CTA

### **4.3 Subcategory Page**

**Shows**

* Articles within the subcategory
* Same filters and breadcrumbs
* Compact cards (mobile)

**Empty State:**

* "No articles in this section" \+ **Request content** CTA → Feedback (prefilled with category/subcategory).

### **4.4 Article Page (Core) — Copy Link & Print**

**Structured Fields**
Title, Category, Subcategory, Content Type, Primary Audience, Tags, Author, **Last Updated**, **Last Reviewed**, **Version (optional)**

**Content Sections**

* **Overview:** summary, audience, time estimate, **problem statement**, **expected outcome**, **prerequisites**
* **When to Use**
* **Step‑by‑Step:** numbered steps; checkboxes for checklists; screenshots where useful
* **Troubleshooting:** common errors, alternatives, **escalation path**
* **Related Articles:** bidirectional, relevance‑ranked
* **External Resources:** minimal, authoritative

**Article‑Level Features**

* **Copy Link** (button): copies canonical URL; shows toast "Link copied"
* **Print** (button): triggers print‑optimized layout (see §G)
* "Was this helpful?" (Yes/No), **Report outdated**, **Suggest improvement**, Reading time
* **Placement (Desktop)**:
  * **Article Header Bar** (below the global Header, right‑aligned):
    `[ Copy Link ] [ Print ] [ Helpful? ] [ Report outdated ]`
* **Placement (Mobile)**:
  * **Sticky action bar** just below the Header with icons \+ labels:
    `🔗 Copy 🖨️ Print 👍 Helpful ⚠️ Outdated`

**Print Requirements**

* Use `@media print`: hide nav, Footer, action bars, filters
* Keep **title \+ metadata** visible; ensure body font ≥ 12pt; clear headings; inline link URLs
* Avoid background colors; high contrast; page breaks before major sections

### **4.5 Search Results — No‑Results CTA → Prefilled Submission**

**When results exist**

* Ranked list, filters available (Category/Role/Content Type), suggestions

**No‑results state (feature)**

* Show **Similar terms** suggestions
* Show **CTA: "Request this article"**
* **On click:** route to Feedback Submission with **prefill**:
  * `type=request_article`
  * `source=search`
  * `query={userQuery}`
  * `category_guess={bestGuess?}`
  * `role_filter={activeRole?}`

### **4.6 Feedback Submission — Prefill Rules**

**Form Fields**

* Related Article (auto‑filled if coming from an article)
* Description (free text)
* Suggested Change (free text)
* Optional Contact Info
* **Hidden/Prefilled Context**:
  * From **Search (no results)**: `type=request_article`, `source=search`, `query`, optional `category_guess`, `role_filter`
  * From **Article**: `type=improvement` or `report_outdated`, `source=article`, `article_id/slug`, `article_title`, `article_url`
  * From **Footer**: `source=footer`

**UX**

* Context pill at top (e.g., "Request from search: 'vpn reset'")
* Submit → Thank‑you with reference ID
* Offer "Back to results" / "Back to article"

### **4.7 User Journeys**

1. **Landing → Search → Article → Fix → (optional) Feedback**
2. **Category → Subcategory → Article**
3. **Search (no results) → Request article (prefilled)**
4. **Article → Suggest improvement / Report outdated (prefilled)**

## **5) Admin System**

### **5.1 Admin Login & Roles**

* Roles: Viewer / Editor / Publisher / Super Admin
* Role‑based permissions and secure authentication

### **5.2 Admin Dashboard**

* **Content Health:** total articles, drafts, outdated candidates
* **Analytics Summary:** most viewed, top requests, trends
* **Feedback Overview:** pending, resolved, high‑priority
* Quick actions: Add Article, Review Feedback, Manage Categories

### **5.3 Category Management**

* Create, edit, reorder, **archive** (no hard delete)

### **5.4 Subcategory Management**

* Create under category, reassign, reorder

### **5.5 Article Management & Workflow**

* List view: Title, Category, Content Type, Audience, Status, Views, Last Updated
* Structured editor: fields for Overview, Steps, Troubleshooting, Related, External links
* Workflow: **Draft → Review → Publish → Archive** (soft delete)
* Optional **audit trail**

### **5.6 Feedback & Review Queue**

* Data: related article, user message, date, **status** (Pending / In Review / Resolved / Rejected)
* Actions: edit article, respond, mark resolved, link feedback to updates

### **5.7 User & Role Management**

* Add editors, assign permissions, remove access, view activity logs

### **5.8 System Settings**

* Content types, role labels, tag management, branding, integrations (future)

### **5.9 Admin Journeys**

* **Login → Dashboard**
* **Add/Edit → Review → Publish**
* **Feedback → Action → Resolve**
* **Governance:** Archive outdated, reassign categories, update metadata

## **6) Feedback & Intelligence Layer**

* Unified intake from **articles**, **no‑results searches**, and **Footer**
* Status tracking (if contact provided), optional responses, closure notifications
* Feeds intelligence: what is used, what is missing, where to improve

## **7) Analytics & Data**

**Views Tracking**

* Increment on article open; store `view_count`, `last_viewed`

**Request Tracking**

* From no‑results and request submissions: `topic`, `frequency`, `status`

**Key Metrics**

* **User:** time to find article, resolution rate, feedback volume
* **Admin:** content freshness, feedback response time, article usage/trending

**Privacy:** content‑level analytics only (no personal tracking).

## **8) Color & Theme Strategy (Consistent Across All Pages/Sites)**

**Palette**

* **Primary Green `#00A651`** — headers, CTAs, category accents, links
* **Accent Orange `#F5A623`** — secondary actions, notices, highlights
* **Teal `#00A5A5`** — tags, metadata, subtle accents
* **Dark Brown `#4D2C0A` / Neutral `#333333`** — readable text
* **Beige `#F2E2C1`**, **Light Green `#E6F2E6`**, **White `#FFFFFF`** — cards & backgrounds

**Rules**

* Single **design token** source for colors, spacing, typography
* Global components (Header, Footer, Buttons, Tags) consume tokens
* **No one‑off page colors**; keep branding uniform across the whole app

## **9) Accessibility, Performance & Mobile Responsiveness**

**Accessibility (non‑negotiable)**

* High contrast, keyboard operability, visible focus states
* Semantic landmarks (`header`, `nav`, `main`, `footer`)
* Screen reader labels, alt text, ARIA judiciously

**Performance**

* Debounced search, lazy list rendering, accessible pagination
* Cache content where feasible, minimize bundle size
* Prefer native browser features; avoid unnecessary libraries

**Mobile**

* Mobile‑first layout, stacked cards, sticky Header and Article action bar
* Large tap targets, safe area insets respected

## **10) Technology Stack & DevOps (Simple Structure, No Monorepo)**

**Frontend**

* Modern JS framework (e.g., Next.js or similar)
* Styling: **Tailwind CSS** with theme tokens
* Hosting: **Vercel**
* Database: **Airtable** (via API)
* Version Control: **GitHub**
* State: Zustand (lightweight) (recommend lighter)
* **No Monorepo / TurboRepo**, **no IDE requirement**

**Environment Variables (store securely; never commit)**

AIRTABLE\_BASE\_ID=appfKb1d7tKI6ErDD
AIRTABLE\_PAT=***REDACTED***

**Suggested File Structure (scales simply)**

src/
  app/                     	\# (or pages/) routes
	layout.tsx            	\# global shell (Header, Footer, providers)
	page.tsx              	\# Home (the ONLY place with search UI)
	search/page.tsx       	\# results
	category/\[slug\]/page.tsx
	category/\[slug\]/\[sub\]/page.tsx
	article/\[slug\]/page.tsx
	feedback/page.tsx
	admin/
  	page.tsx
  	articles/
    	page.tsx
    	new/page.tsx
    	\[id\]/page.tsx
  	categories/page.tsx
  	feedback/page.tsx
  components/
	shell/
  	Header.tsx          	\# intelligent, no search except on Home
  	Footer.tsx
  	Breadcrumbs.tsx
	search/
  	HomeSearch.tsx      	\# hero search (Home only)
  	SearchResults.tsx
  	NoResultsCTA.tsx
	article/
  	ArticleHeader.tsx   	\# Copy/Print/Helpful/Outdated (desktop)
  	ArticleActionBar.tsx	\# sticky (mobile)
  	ArticleContent.tsx
  	HelpfulWidget.tsx
  	RelatedArticles.tsx
	feedback/
  	FeedbackForm.tsx    	\# reads prefill from query params
  	FeedbackToast.tsx
	ui/
  	Button.tsx
  	Tag.tsx
  	Card.tsx
  	Toast.tsx
  lib/
	airtable.ts           	\# CRUD wrapper
	analytics.ts          	\# views, trending
	routes.ts             	\# route builders for feedback, articles
	search.ts             	\# fuzzy/synonym logic
	featureFlags.ts
  styles/
	globals.css
	theme.css             	\# tokens for palette/typography/spacing
	print.css             	\# print rules (see Appendix G)
  state/
	filtersStore.ts       	\# role/content-type filters (persist)
	uiStore.ts            	\# header context, toasts, mobile bars
public/
  favicon.ico
  logo.svg

**Why this scales**

* Clear separation of concerns (routes, components, lib, state, styles)
* Global shell keeps Header/Footer persistent & context‑aware
* Easy to grow: add routes and components without repo complexity

## **11) Success Metrics**

**User Side**

* Time to find the right article
* Resolution rate (self‑service success)
* Feedback volume (quality & quantity)

**Admin Side**

* Content freshness (Last Updated / Last Reviewed)
* Feedback response time
* Article usage & trending

## **12) Appendix**

### **A) Article Template (Markdown)**

\# {Article Title}

**Category:** {Category}
**Subcategory:** {Subcategory}
**Content Type:** {Guide | Quick Fix | Policy | Checklist | FAQ}
**Primary Audience:** {e.g., Field Staff}
**Tags:** \#{tag1} \#{tag2} \#{tag3}
**Author:** {Name}
**Last Updated:** {YYYY-MM-DD}
**Last Reviewed:** {YYYY-MM-DD}
**Version:** {optional}

\---

\#\# Overview
\- **Summary:** {1–3 sentences}
\- **Who is this for:** {audience}
\- **Time estimate:** {e.g., 5–10 minutes}
\- **Problem statement:** {what issue this solves}
\- **Expected outcome:** {what success looks like}
\- **Prerequisites:** {accounts, permissions, tools}

\#\# When to Use This Guide
{Contexts where this applies}

\#\# Step-by-Step Instructions
1\. {Step}
2\. {Step}
3\. {Step}

\#\# Troubleshooting
\- **Issue:** {Symptom} → **Fix:** {Solution}
\- **If unresolved:** {Escalation path}

\#\# Related Articles
\- \#
\- \#

\#\# External Resources
\- {Vendor doc} — {URL}

### **B) Content Types—Definitions**

* **Guide:** Longer, structured resolution for multi‑step tasks
* **Quick Fix:** Immediate solution for common issues
* **Policy:** Reference standard/rule set
* **Checklist:** Task‑based, checkboxable sequence
* **FAQ:** Concise answer to a recurring question

### **C) Role Permissions Matrix**

| Capability | Viewer | Editor | Publisher | Super Admin |
| ----- | ----- | ----- | ----- | ----- |
| Read articles | ✅ | ✅ | ✅ | ✅ |
| Create/Edit drafts | ❌ | ✅ | ✅ | ✅ |
| Publish/Archive | ❌ | ❌ | ✅ | ✅ |
| Manage categories/subcategories | ❌ | ❌ | ✅ | ✅ |
| Manage users/roles | ❌ | ❌ | ❌ | ✅ |
| View analytics | ✅ | ✅ | ✅ | ✅ |
| Review/Resolve feedback | ❌ | ✅ | ✅ | ✅ |
| Configure system settings | ❌ | ❌ | ❌ | ✅ |

### **D) Workflow States**

Draft  →  Review  →  Publish  →  Archive
         	↘ (Revisions) ↗

* Only **Published** is user‑visible
* Prefer **Archive** over delete; add optional **audit trail**

### **E) Conceptual Diagram (ASCII)**

\[Admin System\]                        \[User-Facing System\]
   ┌───────────┐                          ┌──────────────┐
   │  Editors  │  Create/Update Content   │   Home       │
   └─────┬─────┘──────────────┬──────────▶│ (Search)     │
         │                    │            │ Categories   │
   ┌─────▼─────┐      ┌───────▼──────┐    └─────┬────────┘
   │  Workflow │      │ Structured   │          │
   │ (Draft→…) │      │   Content    │◀─────────┘
   └─────┬─────┘      └───────┬──────┘
         │                    │
   ┌─────▼─────────┐   Views/Usage   ┌───────────┐
   │ Feedback Queue │◀───────────────▶│ Articles  │
   └─────┬─────────┘   Requests       └─────┬─────┘
         │                                  │
         └───────── Respond/Resolve ────────┘

### **F) Feature Structure Notes (Routing, State, Components)**

**Home Search (only here)**

* Route: `/`
* Component: `HomeSearch` (hero input, autocomplete, fuzzy matching)
* State: local input \+ debounced query; results shown on `/search?q=...`

**Search Results with No‑Results CTA**

* Route: `/search?q={query}`
* Component: `SearchResults`, `NoResultsCTA`
* Action: `NoResultsCTA` → `/feedback?type=request_article&source=search&query={q}&category_guess={c?}&role_filter={r?}`

**Article Page (Copy & Print)**

* Route: `/article/[slug]`
* Components: `ArticleHeader` (desktop actions), `ArticleActionBar` (mobile), `ArticleContent`
* Actions:
  * Copy: `navigator.clipboard.writeText(canonicalUrl)` \+ toast
  * Print: `window.print()` (styles in `print.css`)

**Feedback Submission (Prefill)**

* Route: `/feedback?type=...&source=...` (+ specific fields)
* Component: `FeedbackForm` reads query params to prefill and show a context pill

**Persistent Header (No Search Except Home)**

* Component: `Header` reads route context from `uiStore` / router
* Shows navigation and context actions only; **search not rendered** unless route is Home

**Theme Consistency**

* `theme.css` provides CSS variables for colors/spacing/typography; used throughout

### **G) Print Styles (Starter CSS)**

/\* styles/print.css \*/
*@media print {*
  */\* Hide navigation & app chrome \*/
  *header, nav, footer, .action-bar, .filters, .breadcrumbs, .toast { display: none \!important; }*

  */\* Article layout \*/
  *main, .article-container {*
	*width: 100% \!important;*
	*margin: 0 \!important;*
	*padding: 0 12mm \!important;*
	*color: \#000;*
	*background: \#fff \!important;*
  *}*

  */\* Readable typography \*/
  *body { font: 12pt/1.5 system-ui, \-apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif; }*
  *h1 { font-size: 20pt; page-break-before: avoid; }*
  *h2 { font-size: 16pt; page-break-after: avoid; }*
  *h3 { font-size: 14pt; }*

  */\* Show URLs after links for print context \*/
  *a\[href\]:after { content: " (" attr(href) ")"; font-size: 10pt; }*

  */\* Respect images and headings in print \*/
  *img { max-width: 100% \!important; page-break-inside: avoid; }*
  *h2, .section-break { page-break-before: always; }*

  */\* Avoid heavy backgrounds \*/
  \* { \-webkit-print-color-adjust: exact; print-color-adjust: exact; }
}

## Installation and Setup

To set up the project locally:

1. Clone the repository.
2. Copy `.env.local.example` to `.env.local` and fill in the required environment variables.
3. Run `npm install`.
4. Run `npm run dev` to start the development server.

For deployment, push to GitHub and configure in Vercel with the same environment variables.
