# EcoStory — Project Reference

> Codebase walkthrough for anyone picking up work on this repo.
> Path: `c:\python_project\ecostory` · Branch: `main` · Live: https://ecostory-site.web.app

---

## 1. What it is

**EcoStory** (referred to internally in older docs as *"Project Kabir"*) is a cultural-heritage web application about Agra's historical monuments — the Taj Mahal, Agra Fort, Fatehpur Sikri and related sites. It consists of:

- a **public site** — homepage, about, contact, an "Explore History" map page, and a blog
- an **admin CMS** — blog authoring with a rich editor, contact-submission inbox, and a dashboard

Despite living under `c:\python_project\`, there is **no Python in this project**. It is entirely JavaScript/TypeScript.

---

## 2. Technology stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Astro 5.7** with `output: 'server'` | Server-side rendered, not a static site |
| Adapter | `@astrojs/node` (standalone mode) | Output bundled into a Firebase Function |
| UI | `.astro` components with scoped `<style>` | Plain CSS — no Tailwind, no CSS framework |
| React | `@astrojs/react` + React 19 | **Configured but unused** — zero `.tsx`/`.jsx` files exist |
| Database | **Firebase Firestore** | Client SDK, called from SSR frontmatter *and* browser scripts |
| Auth | **Firebase Auth** (email/password) | Client-side only; no server session |
| Admin SDK | `firebase-admin` | Used by `/api/users` and `setup.mjs` |
| Hosting | **Firebase Hosting + Cloud Functions gen 2** | `nodejs20` runtime |
| Rich text | **EditorJS** + 11 plugins | Blog post authoring format (JSON blocks) |
| Also installed | Quill, Express | Present in `package.json`, not used in `src/` |
| Maps | Leaflet, leaflet-draw, `@googlemaps/js-api-loader` | **Currently dead code** — see §7 |
| State | nanostores + `@nanostores/persistent` | `authStore.ts` exists but is imported nowhere |

---

## 3. Directory structure

```
ecostory/
├── astro.config.mjs              # SSR + node adapter + react integration
├── firebase.json                 # hosting: dist/client; rewrite ** → "server" function
├── .firebaserc                   # default project: ecostory-site
├── package.json                  # deps + dev/build/deploy scripts
├── tsconfig.json                 # extends astro/tsconfigs/strict, baseUrl: "."
├── setup.mjs                     # one-off admin script: seeds Firestore + writes rules
│
├── functions/
│   ├── index.js                  # gen-2 onRequest → dynamic import('./dist/server/entry.mjs')
│   ├── package.json              # hand-copied list of Astro's transitive deps
│   └── dist/                     # build output copied here at deploy time
│
├── public/                       # static assets, favicons
├── dist/                         # build output (client/ + server/), gitignored
│
├── src/
│   ├── pages/                    # ← file-based routing; the real app surface
│   │   ├── index.astro           (1295 lines) homepage
│   │   ├── about.astro           (499)
│   │   ├── contact.astro         (581)
│   │   ├── map.astro             (191) iframe of oldmapsonline.org
│   │   ├── privacy-policy.astro  (187)
│   │   ├── terms-conditions.astro(232)
│   │   ├── blogs/
│   │   │   ├── index.astro       (467) blog listing
│   │   │   └── [slug].astro      (1048) blog detail
│   │   ├── admin/
│   │   │   ├── index.astro       (539) dashboard — uses hardcoded sample data
│   │   │   ├── contacts.astro    (980) contact-submission inbox
│   │   │   └── blogs/
│   │   │       ├── index.astro   (1332) post list
│   │   │       ├── new.astro     (1701) EditorJS create
│   │   │       └── [id]/edit.astro (984) EditorJS edit
│   │   ├── auth/login.astro      (563) inline Firebase auth via CDN
│   │   └── api/users.ts          (171) admin-only user CRUD (REST)
│   │
│   ├── components/
│   │   ├── layout/               Layout, AdminLayout, Navbar, Header, Footer, styles/_admin.css
│   │   ├── ui/                   ~20 presentational components (Hero, Card, Section, Grid,
│   │   │                         Modal, Tabs, Accordion, Timeline, BlogCard, ContactForm, …)
│   │   ├── auth/                 LoginForm, RegisterForm, AuthGuard, LogoutButton   [UNUSED]
│   │   ├── admin/                FeatureForm, FeatureList, FeatureTabs,
│   │   │                         DrawingControls, StatusPanel                       [UNUSED]
│   │   ├── map/                  MapContainer, MapControls, InfoPanel, Legend       [UNUSED]
│   │   ├── Button.astro          used by pages
│   │   └── Welcome.astro         Astro starter leftover                             [UNUSED]
│   │
│   ├── layouts/Layout.astro      Astro starter stub                                 [UNUSED]
│   │                             (the real layout is components/layout/Layout.astro)
│   │
│   ├── lib/
│   │   ├── auth-client.ts        function-style auth wrapper   ← THE ONE IN USE
│   │   ├── firebase/auth.ts      AuthService class — duplicate of the above [UNUSED]
│   │   ├── firebase/types.ts     User / AuthState / credential types
│   │   ├── stores/authStore.ts   nanostores auth state                      [UNUSED]
│   │   ├── leaflet.ts            map init, markers, polylines, draw control [UNUSED]
│   │   └── types.ts              City/Monument/Submonument/Tour/Route interfaces
│   │
│   ├── data/                                                                [ALL UNUSED]
│   │   ├── collections/          cities, monuments, submonuments, tours,
│   │   │                         extendedTours, routes — Firestore CRUD + onSnapshot
│   │   └── schemas/              hand-rolled `validate(data) → string[]` (no zod)
│   │
│   ├── scripts/                                                             [ALL UNUSED]
│   │   ├── admin/                drawing.ts, manageFeature.ts
│   │   └── map/                  initializeMap, loadFeatures, handleInteractions,
│   │                             importExport, status
│   │
│   ├── styles/                   global.css, components.css, map.css
│   └── utils/
│       ├── firebase.js           client SDK init + monument/city helpers (hardcoded config)
│       └── firebase-admin.js     admin SDK init from env vars + exportAllUsers()
│
└── (docs & scratch at root)
    README.md, summary.txt, structure.txt, db.txt, firebase-rules.txt,
    auth-test.md, auth-files-analysis.md, streamlined-auth-files.md,
    test.html, testIfream.html
```

---

## 4. Routes

### Public
| Route | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/about` | `src/pages/about.astro` |
| `/contact` | `src/pages/contact.astro` |
| `/map` | `src/pages/map.astro` |
| `/blogs` | `src/pages/blogs/index.astro` |
| `/blogs/[slug]` | `src/pages/blogs/[slug].astro` |
| `/privacy-policy` | `src/pages/privacy-policy.astro` |
| `/terms-conditions` | `src/pages/terms-conditions.astro` |

Nav (from `components/layout/Navbar.astro`): Home · About · Explore History · Blog · Contact

### Admin
| Route | File |
|---|---|
| `/admin` | `src/pages/admin/index.astro` |
| `/admin/contacts` | `src/pages/admin/contacts.astro` |
| `/admin/blogs` | `src/pages/admin/blogs/index.astro` |
| `/admin/blogs/new` | `src/pages/admin/blogs/new.astro` |
| `/admin/blogs/[id]/edit` | `src/pages/admin/blogs/[id]/edit.astro` |
| `/admin/map` | **linked from dashboard but source deleted → 404** |

### Auth / API
| Route | File |
|---|---|
| `/auth/login` | `src/pages/auth/login.astro` |
| `/api/users` | `src/pages/api/users.ts` — `GET`, `POST`, `PUT`, `DELETE` |

---

## 5. Data model

### Collections actually used by current code

| Collection | Written by | Read by |
|---|---|---|
| `blogs` | `/admin/blogs/new`, `/admin/blogs/[id]/edit` | `/blogs`, `/blogs/[slug]`, `/admin/blogs` |
| `categories` | admin blog pages | blog listing + editors |
| `contactSubmissions` | `components/ui/ContactForm.astro` | `/admin/contacts` |
| `users` | `/api/users` (role + metadata docs) | `/api/users` |

Blog post content is stored as **EditorJS JSON block data**, rendered back out in `blogs/[slug].astro`. See **§10 — Blog subsystem deep dive** for the full field-by-field breakdown.

### Heritage model — coded but orphaned

Fully implemented in `src/data/collections/` + `src/data/schemas/`, referenced by nothing:

- **cities** — `id, name, lat, lng, description, period, zoom_level, is_active`
- **monuments** — `id, name, city_id, address, latitude, longitude, description, image_url, period, year_built, is_active`
- **submonuments** — `id, parent_id, name, latitude, longitude, description, content, image_url, tags, is_active`
- **routes / tours / extendedTours** — `id, name, description, type, color, distance, estimated_time, monument_ids, order, polyline, is_active`; polylines are arrays of `{lat, lng}`

Each collection module exports `getX / addX / updateX / deleteX / subscribeToX` (the last using Firestore `onSnapshot`). Full historical detail lives in `summary.txt` and `db.txt`.

---

## 6. Build, run, deploy

```bash
npm install
npm run dev        # astro dev
npm run build      # → dist/client (assets) + dist/server/entry.mjs (SSR handler)
npm run preview    # astro preview
npm run deploy     # build → copyfiles dist/server/** functions → firebase deploy --only hosting,functions
```

**Request flow in production:**

```
browser → Firebase Hosting
            ├── static asset present in dist/client?  → served directly
            └── everything else (rewrite "**")        → Cloud Function "server"
                                                          └── functions/index.js
                                                                └── import('./dist/server/entry.mjs')
                                                                      └── Astro node handler
```

`functions/package.json` restates Astro's whole transitive dependency tree by hand, which is why it is unusually long — that's the reason `copyfiles` is part of the deploy script.

**Environment variables** (`.env` / `.env.local`), consumed by `src/utils/firebase-admin.js` and `src/pages/api/users.ts`:

```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY        # newlines escaped as \n, unescaped at runtime
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
```

`setup.mjs` is a separate one-off admin script that reads a differently-named set of `Firebase_*` env vars, seeds Firestore, and pushes security rules.

---

## 7. State of the codebase — read before you start

### 7.1 The map feature was gutted
`/map` is now nothing but a full-screen `<iframe>` pointed at `oldmapsonline.org`. The original Leaflet/Google-Maps admin (cities, monuments, submonuments, routes, polyline editor) still exists as **compiled output** under `functions/dist/server/pages/admin/map/**`, but its **source was deleted** — there is no `src/pages/admin/map/`. Consequently:

- `/admin/map`, linked from the dashboard, 404s on a fresh build
- `src/lib/leaflet.ts`, `src/scripts/**`, `src/components/map/**`, `src/components/admin/**`, and all of `src/data/**` are unreachable

**First decision to make:** rebuild the map admin from this scaffolding, or delete it.

### 7.2 The admin dashboard shows fake data
`src/pages/admin/index.astro` (~lines 36–72) hardcodes three sample monuments, two sample submonuments, and a literal `count: 8` for contact submissions — with a comment reading *"Static sample data instead of Firebase."*

### 7.3 Secrets are committed to git
- `.env.local` and `src/utils/Originalfirebase creds.txt` are **tracked in the repository**
- A service-account JSON sits at repo root (`ecostory-site-firebase-adminsdk-*.json`) and again at `src/utils/credentials.json`
- Firebase web config and the Google Maps key are hardcoded in `src/utils/firebase.js` and inline in `auth/login.astro`

Web API keys being public is normal and fine. The **service-account private key is not** — it should be rotated and purged from history. Note also that `.gitignore` uses a blanket `*.json`, which is broad enough to hide files you may later want tracked.

### 7.4 Firestore rules are effectively open
`firebase-rules.txt` defines sensible per-collection rules, then ends with:

```
match /{document=**} {
  allow read, write: if true;
}
```

which overrides everything above it. Any client can read or write any collection.

### 7.5 Admin auth is browser-side only
`components/layout/AdminLayout.astro` runs `onAuthStateChange` in a client `<script>` and redirects to `/auth/login` if there's no user — but the server has already rendered and sent the page. There is no session cookie and no Astro middleware. Only `/api/users` performs genuine verification (Bearer ID token + `admin` custom claim).

That layout also imports `'src/lib/auth-client.ts'` as a bare path; it resolves only because `tsconfig.json` sets `baseUrl: "."`.

### 7.6 Three parallel auth implementations
1. `src/lib/auth-client.ts` — function style, **actually used**
2. `src/lib/firebase/auth.ts` — `AuthService` class, functionally identical, unused
3. `src/pages/auth/login.astro` — inline copy that loads Firebase from the **gstatic CDN** rather than npm, and stashes the user in `localStorage.authUser`

`src/components/auth/LoginForm.astro` (643 lines) and `RegisterForm.astro` (767) are a fourth variant, also unused.

### 7.7 Duplication and file size
`admin/blogs/new.astro` is 1701 lines, `admin/blogs/index.astro` 1332, `index.astro` 1295, `blogs/[slug].astro` 1048. Each page inlines its own Firestore imports and client `<script>` blocks rather than sharing helpers. Total `src/` is ~20,400 lines.

### 7.8 Two `Layout.astro` files
`src/layouts/Layout.astro` is the untouched Astro starter stub (title still "Astro Basics") and is unused. The real one is `src/components/layout/Layout.astro`.

---

## 8. Suggested starting points

1. **Decide the map's fate** — rebuild `/admin/map` from `src/data` + `src/lib/leaflet.ts`, or delete the ~2,000 lines of orphaned map code and drop the Leaflet/Google-Maps dependencies.
2. **Rotate and purge the service-account key**, then untrack `.env.local` and the creds text file.
3. **Fix the Firestore catch-all rule** and deploy real rules.
4. **Wire the admin dashboard to live Firestore counts** instead of sample data.
5. **Collapse the auth implementations to one** (`lib/auth-client.ts`) and delete the rest.
6. **Add server-side admin protection** — Astro middleware validating a session cookie, so admin HTML isn't rendered for anonymous requests.
7. **Extract shared Firestore helpers** out of the oversized blog pages.

---

## 9. Legacy documents in the repo

These predate the current state and describe the map-era architecture — useful as history, misleading as current spec:

| File | Contents |
|---|---|
| `README.md` | Project overview; still describes maps/3D models as live features |
| `summary.txt` | Detailed analysis of the old map system, data model, styling theme |
| `structure.txt` | An aspirational directory tree that no longer matches `src/` |
| `db.txt` | Firestore data dump / schema notes |
| `firebase-rules.txt` | Current security rules (see §7.4) |
| `auth-test.md`, `auth-files-analysis.md`, `streamlined-auth-files.md` | Notes from the auth refactor |
| `test.html`, `testIfream.html` | Scratch files for the map-iframe experiment |

---

# 10. Blog subsystem — deep dive

The blog is the only fully-wired feature in the app: it has a real admin UI, real Firestore persistence, real image uploads, and real public rendering. This section documents it end to end.

## 10.1 Overall flow

```
┌─ ADMIN (browser) ─────────────────┐        ┌─ FIREBASE ────────────┐
│ /admin/blogs/new                  │        │                       │
│ /admin/blogs/[id]/edit            │        │  Firestore            │
│   EditorJS ── editor.save() ──────┼───────▶│    blogs/{autoId}     │
│   image picker ───────────────────┼───┐    │    categories/{autoId}│
│                                   │   │    │                       │
│ /admin/blogs (list, filter, del)  │   └───▶│  Storage              │
└───────────────────────────────────┘        │    blogs/hero/…       │
                                             │    blogs/content/…    │
┌─ PUBLIC (SSR on the server) ──────┐        │    blogs/gallery/…    │
│ /blogs        listing + featured  │◀───────┤                       │
│ /blogs/[slug] single post render  │        └───────────────────────┘
└───────────────────────────────────┘
```

Note the asymmetry: **admin writes happen in the browser** (client Firebase SDK inside `<script>` blocks), while **public reads happen on the server** (client SDK called from Astro frontmatter during SSR). Both use `src/utils/firebase.js`. Nothing goes through `firebase-admin` or an API route.

## 10.2 The `blogs` document shape

Written by `savePost()` in `admin/blogs/new.astro` (~line 1630):

| Field | Type | Notes |
|---|---|---|
| `title` | string | required; 100-char counter in UI (not enforced on save) |
| `slug` | string | required; **uniqueness is not checked** |
| `excerpt` | string | required; 200-char counter |
| `content` | **string** | `JSON.stringify(editorData)` — a *stringified* EditorJS payload, not an object |
| `heroImage` | string \| null | Storage download URL |
| `additionalImages` | string[] | gallery upload URLs |
| `author` | string | free text, not a user ref |
| `category` | string | **Firestore document ID** of a `categories` doc |
| `tags` | string[] | |
| `status` | `'draft'` \| `'published'` | |
| `featured` | boolean | drives the featured strip on `/blogs` |
| `wordCount` | number | computed from editor blocks |
| `readTime` | number | `Math.ceil(wordCount / 200)` |
| `seo` | object | `{ title, description, keywords: string[] }`, each defaulting to title/excerpt |
| `publishDate` | Timestamp | `serverTimestamp()` **at creation only** |
| `createdAt` | Timestamp | `serverTimestamp()` |
| `updatedAt` | Timestamp | `serverTimestamp()`; refreshed by the edit page |

`categories` documents: `{ name, slug, description, createdAt, updatedAt }` — managed from the Categories tab on `/admin/blogs`.

## 10.3 File-by-file

| File | Lines | Role |
|---|---|---|
| `src/pages/admin/blogs/index.astro` | 1332 | Post list + category manager, delete modals |
| `src/pages/admin/blogs/new.astro` | 1701 | EditorJS create form → `addDoc` |
| `src/pages/admin/blogs/[id]/edit.astro` | 984 | EditorJS edit form → `updateDoc` |
| `src/pages/blogs/index.astro` | 467 | Public listing: featured, search, category filter, pagination |
| `src/pages/blogs/[slug].astro` | 1048 | Public single post: block renderer, related posts, SEO |
| `src/components/ui/BlogCard.astro` | 251 | Card used by listing and homepage |

### `/admin/blogs` (list)
SSR-fetches **all** blogs (`orderBy publishDate desc`) and all categories in one `Promise.all`, computes status counts (all / published / draft / featured), then renders two tabs:
- **Posts** — table with client-side status filter buttons, text search, and a category dropdown; all filtering is DOM-level over the already-rendered rows.
- **Categories** — cards with post counts, plus a modal for create/update (`addDoc` / `updateDoc` on `categories`).

Deletes for both posts and categories share one confirmation modal that stores the target in hidden `#delete-id` / `#delete-type` inputs, then calls `deleteDoc` and `window.location.reload()`.

### `/admin/blogs/new`
The heaviest file in the repo. Inside its client `<script>`:
- **EditorJS** initialised on `#blog-editor-container` with 11 tools: header (levels 2–4), list, checklist, quote, code, table, marker, inlineCode, image, embed (YouTube/Twitter/Instagram/CodePen), plus the paragraph default.
- **Image upload** — `uploadImage(file, folder)` writes to Storage at `blogs/{folder}/{Date.now()}_{sanitised name}` and returns `getDownloadURL()`. Used by the EditorJS image tool (`content` folder), the hero picker, and the gallery.
- **Slug generation** — a "generate" button derives the slug from the title: lowercase, strip non-word chars, spaces → hyphens. Manual edits are preserved.
- **Character counters** for title / excerpt / SEO title / SEO description; **word count** and read-time from block text.
- **Tag chips** — Enter-to-add pills stored in a local `tags` array.
- **Fullscreen toggle** for the editor pane.
- **Auto-save indicator** — fires 3s after the last change, shows "Saving…" then "Saved". It performs **no write at all**; the comment in the source literally says `// Simulate auto-save`.
- **`beforeunload` guard** when the form is dirty.
- **`savePost()`** — validates title/slug/excerpt/author/category and non-empty content, assembles the object above, `addDoc`s it, then redirects to `/admin/blogs`. "Save Draft" simply sets the status select to `draft` before calling the same function.

### `/admin/blogs/[id]/edit`
SSR-loads the doc by ID, redirects to `/admin/blogs` if missing, and pre-fills every field. Content is parsed from string to object in the frontmatter, then handed to EditorJS via its `data` option. `savePost()` here is a slimmer copy of the create version — no per-field error list (just "fill in all required fields"), no auto-save, no dirty guard — and it calls `updateDoc`.

### `/blogs` (public listing)
`export const prerender = false`. Runs three Firestore queries per request:
1. published posts, optionally `where category == <id>`, `orderBy publishDate desc`
2. featured posts (`status == published && featured == true`, `limit 3`)
3. all categories, `orderBy name`

Search (`?search=`) is a case-insensitive substring match over `title` + `excerpt` done **in memory** after the fetch. Pagination (`?page=`, 9 per page) is likewise `Array.slice()` over the full result set. The page title adapts to the active filter.

### `/blogs/[slug]` (public post)
Queries `blogs` by `slug` + `status == published`, `limit(1)`. If nothing matches it returns `Astro.redirect('/blogs')`. Then it formats the date, parses `content` (handling both string and object), loads the category doc by ID, and fetches up to 3 related posts in the same category. SEO title/description fall back from `seo.*` to `title`/`excerpt`.

The **block renderer** is an inline `if/else` chain over `post.content.blocks` handling exactly six types:

`paragraph` · `header` (h2/h3/h4) · `list` (ordered/unordered) · `image` · `quote` · `embed`

Text is injected with `set:html` so EditorJS inline formatting (bold, marker, inline code) survives.

## 10.4 Known gaps and gotchas

These are the things most likely to bite you while working on the blog.

1. **Three EditorJS tools have no public renderer.** `code`, `table`, and `checklist` are offered in the toolbar but `blogs/[slug].astro` doesn't handle them — those blocks silently render as nothing. Either add the cases or remove the tools.

2. **`content` is a stringified JSON blob**, not a Firestore map. Every consumer has to `JSON.parse` defensively. Storing it as a real object would make it queryable and remove the parse dance in three files.

3. **`publishDate` is never updated.** It's set with `serverTimestamp()` when the doc is created — including for drafts — and the edit page doesn't touch it. A draft written in January and published in June sorts as a January post. Since the listing orders by `publishDate desc`, this directly affects what readers see first.

4. **The homepage blog section is hardcoded.** `src/pages/index.astro` line 111 defines a literal `recentBlogs` array of three fictional posts with slugs that don't exist in Firestore. Clicking any of them 404s (well — redirects to `/blogs`). This should be a real query.

5. **`BlogCard` links categories to a route that doesn't exist**: `/blogs/category/{name.toLowerCase()}`. The working URL is `/blogs?category={categoryDocId}`. Every category chip on every card is a dead link.

6. **The related-posts query almost certainly needs a composite index.** It combines `where category ==`, `where status ==`, `where slug !=`, `orderBy slug`, `orderBy publishDate desc`. Firestore will reject that without a matching index, and the error is unhandled in SSR — meaning a 500 on the post page rather than a graceful skip. Wrap it in try/catch and create the index.

7. **The listing doesn't scale.** Every request pulls *all* published posts before slicing 9 of them, and search runs after that full fetch. Fine at 20 posts, a problem at 500. Firestore `startAfter` cursors are the fix; full-text search needs an external index if it grows.

8. **Slugs aren't unique-checked.** Two posts can share a slug; `limit(1)` means one silently wins. Add a `where('slug','==',…)` check before save.

9. **Auto-save is theatre.** The indicator says "Saved" while nothing was written. This is worse than having no indicator — it invites data loss. Either implement it (draft `setDoc` with merge) or delete the UI.

10. **Anyone can write to `blogs`.** Writes go straight from the browser, and the deployed Firestore rules end in a catch-all `allow read, write: if true` (§7.4). There's no auth check in `savePost()` either. Combined with `set:html` on block text, that's a stored-XSS path on the public site.

11. **Deleted images stay in Storage.** Removing an image from the gallery only splices the local array; the Storage object is never deleted. Same for hero images that get replaced.

12. **Two different tag UIs.** `new.astro` uses Enter-to-add chips; `edit.astro` uses a plain comma-separated text input (`value={blog.tags?.join(', ')}`). Same data, two interaction models — worth unifying.

13. **`admin/blogs/index.astro` imports `Firestore` and `addDoc`/`updateDoc` in the frontmatter** where they're unused, a leftover from an earlier iteration.

## 10.5 Suggested order of work on the blog

1. Fix the **public renderer gaps** (code/table/checklist) — cheap, visible, no data migration.
2. Point the **homepage** at real Firestore posts and fix the **BlogCard category links**.
3. Wrap the **related-posts query** in try/catch and create the composite index.
4. Correct **`publishDate` semantics** — set it when status first flips to `published`.
5. Either implement or remove **auto-save**.
6. Add **slug uniqueness** validation on create and edit.
7. Tighten **Firestore rules** for `blogs` and `categories` to authenticated writes.
8. Extract the duplicated EditorJS config + `savePost` from `new.astro` / `edit.astro` into one shared module — that alone removes several hundred lines.

