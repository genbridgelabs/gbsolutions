# GB Solutions

Website for **GB Solutions**, an interior architecture and turnkey build studio in
Bhubaneswar, Odisha. It is the public site plus a private studio desk: visitors send a
project enquiry, the studio signs in to read them, downloads the book as Excel, and
edits the gallery and video journal that the public sees.

Built with Next.js 16 (App Router, JavaScript), MongoDB via Mongoose, Tailwind CSS v4
and shadcn/ui (Base UI primitives).

---

## What is in here

**Public site** (`/`)

- Editorial one-page site: hero, practice, the work gallery, four-stage process, the
  video journal, and the enquiry form.
- **Gallery** — asymmetric grid with category filters, staggered scroll reveals, hover
  captions, and a full-screen lightbox that is keyboard (← → Esc), click and swipe
  navigable, with a thumbnail strip. Photographs and captions come from the database.
- **Video journal** — a chaptered player with a film list, poster frames, custom
  play/pause, seeking, mute and full-screen controls. Films can be uploaded MP4/WebM
  files or YouTube / Vimeo links.
- **Work archive** (`/work`) — every project listed with its own address; each opens
  a project page at `/work/[slug]` with the story, the facts and the full photograph
  set in a keyboard-navigable lightbox.
- **3D walkthrough** (`/work/[slug]/room`) — an immersive WebGL room built from that
  project's photographs: drag to look, walk with W A S D or the arrow keys, captions
  follow the print you face, and Escape returns to the project.
- **Cost estimator** (`/#estimator`) — six choices (building type, size, scope of
  work, finish, floor area, site) and a live ballpark range, then a short form that
  files the range with the studio as an enquiry.
- The enquiry form validates on the server with Zod, rate-limits by IP, drops honeypot
  submissions, and shows a reference number on success.
- Motion is CSS-first and respects `prefers-reduced-motion`. Photography is graded in
  CSS so every image reads as one studio's work.

**Studio desk** (`/admin`) — the only place with a login

- Email + password against a single account defined in `.env.local`.
- Session is a signed (HS256) httpOnly cookie, valid for 8 hours.
- Protected by `proxy.js` (Next 16's renamed middleware) **and** every admin page and
  API route re-verifies the session server-side.
- Three sections, switched by the tabs under the top bar:

| Section | What it does |
| --- | --- |
| **Form submissions** (`/admin`) | Every field captured, newest first: totals, a 14-day strip, search, status and project-type filters, pagination, a detail dialog with the full record, studio notes, status changes, delete, and **Download Excel**. Enquiries that came through the estimator carry their ballpark range against the budget, and the dialog shows the choices behind it |
| **Gallery** (`/admin/gallery`) | Add, edit, publish/hide, reorder and delete projects; each one holds a cover plus an ordered set of photographs with alt text and captions |
| **Video journal** (`/admin/journal`) | Add, edit, publish/hide, reorder and delete films; upload a file or paste a YouTube / Vimeo link, set the poster frame, place, length and description |

- **Download Excel** exports a real `.xlsx` workbook (SheetJS) using the filters
  currently applied: one *Enquiries* sheet with column widths and autofilter, the
  estimator's range and basis included, plus an *About this file* sheet recording
  what was exported.
- Uploads go to `public/uploads/` and are served from there. They are not committed.

**Data**

Three MongoDB collections in `gb-solutions-dev`:

```
leads          name, phone, email, projectType, city, budget, message,
               estimate{ scope, size, style, work, area, min, max, summary },
               source, status, adminNote, ipHash, createdAt, updatedAt
galleryitems   title, slug, category, typeLabel, place, year, summary, description,
               cover, coverAlt, images[{ url, alt, caption }], order, published,
               timestamps
videos         title, place, recordedOn, duration, note, description, poster,
               posterAlt, source ("file" | "youtube" | "vimeo"), src, order,
               published, timestamps
```

If MongoDB cannot be reached, the public page falls back to the bundled content in
`lib/seed-data.mjs` instead of rendering an empty gallery.

---

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### Environment (`.env.local`)

`.env.local` is git-ignored and already filled in on this machine:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Atlas connection string for the `gb-solutions-dev` database |
| `ADMIN_EMAIL` | The one admin login |
| `ADMIN_PASSWORD` | Admin password (plain, compared in constant time) |
| `SESSION_SECRET` | 32-byte hex string that signs the session cookie (min 24 chars) |
| `NEXT_PUBLIC_SITE_URL` | Optional. Public origin used for absolute metadata URLs |

Change `ADMIN_PASSWORD` and regenerate `SESSION_SECRET` before this goes anywhere real:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Restart `npm run dev` after changing either value — and note that changing
`SESSION_SECRET` signs everyone out.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `node scripts/build-brand.mjs` | Rebuilds the transparent ink/paper marks in `public/brand` plus `app/icon.png`, `app/apple-icon.png` and `app/favicon.ico` (16/32/48) from `raw/logo-gbs.jpeg` |
| `node scripts/build-videos.mjs` | Rebuilds the four journal clips in `public/media/video` with ffmpeg (slow pans from graded stills, grain, fades) |
| `node --env-file=.env.local scripts/seed-content.mjs` | Seeds the gallery and video journal through the admin API. Skips collections that already have rows; `--force` appends anyway |
| `node scripts/mongo-test.mjs` | Pings the cluster and lists collections (needs `MONGODB_URI` in the environment) |

---

## Design notes

The palette comes from the materials the studio actually builds with: lime-plaster
`#e7e2d6`, indigo `#1d2943`, brass `#a67c33`, with laterite for errors. Type is Gloock
(display) and Schibsted Grotesk (text). Structure is carried by hairlines and a
left-hand ledger rail rather than cards and shadows.

The logo in `raw/logo-gbs.jpeg` is a scan, so `scripts/build-brand.mjs` converts it to
transparent single-colour marks (`public/brand/mark-ink.png`, `mark-paper.png`,
`logo-ink.png`, `logo-paper.png`) and generates the icons: `app/icon.png` (512),
`app/apple-icon.png` (180) and a multi-size `app/favicon.ico`.

**Photography and video:** there is no image- or video-generation model in this build
environment, so the photographs are locally stored, consistently graded stills, and the
journal clips are real H.264 files cut from those stills by `scripts/build-videos.mjs`
(a slow push, grain and a fade — seven seconds each). They play in the browser like any
other MP4, but they are not camera footage. Replace them with the studio's own films
before launch: upload an MP4 in **Video journal**, or paste a YouTube / Vimeo link.

**The cost estimator:** the rate card lives in `lib/estimator.js` — per square foot,
by scope of work, adjusted for building type and finish. The browser and
`/api/estimator` import the same module, and the route recomputes the range before it
saves anything, so the desk never receives numbers a visitor could have edited in the
page. The figures are interiors only: structure, loose furniture, appliances and GST
sit outside them, and the section says so. Change the rates in one place and both the
page and the saved enquiries follow.

**The 3D room:** there are no 3D scans or models of these houses, so `/work/[slug]/room`
is not a reconstruction of the building. It is a room — floor, plaster walls, brass
frames, ceiling light and dust — with the project's own photographs hung in it, drawn
with `three` in WebGL. It walks and looks like a space, and it never claims to be
somewhere the photographs are not. Swap in a real glTF scan and the same controls and
HUD would carry it.

---

## Deploying

This is a server-rendered app with a database, an httpOnly session cookie and local
file uploads, so it needs a Node host with a writable disk (Render, Fly, a VPS) rather
than a static or edge host.

1. Set the environment variables above on the host.
2. Use a production MongoDB user — the dev credentials in `.env.local` should not ship.
3. Serve over HTTPS; the session cookie is marked `secure` automatically in production.
4. Point `NEXT_PUBLIC_SITE_URL` at the real origin.
5. Back up `public/uploads/` with the database. On a stateless host, point the upload
   route at object storage instead.
