# Fit & Fed

A fitness and nutrition app for a two-person household — built for Sarah and Dom.

## Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and builds
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [React Router](https://reactrouter.com/) for navigation

## Structure

- `src/layout` — app shell: header, desktop sidebar, mobile bottom navigation
- `src/pages` — Today, Workouts, Body Focus, Meals, Meal Planner, Progress, Profile & Settings
- `src/context/ProfileContext.tsx` — the Sarah / Dom / Household profile switcher
- `src/data` — record types, date helpers, and the localStorage-backed store
- `src/components` — shared UI (page headers, cards, form fields, sheets, icons)
- `src/pwa` — service worker registration
- `public/manifest.webmanifest`, `public/sw.js` — install metadata and the offline app shell

## Data

Everything lives on the device in `localStorage` under `fit-and-fed:data:v1` — there is no
backend and no account. Workouts and meals each belong to a profile: records saved while
Sarah or Dom is selected are private to that person, records saved under **Household** are
visible to everyone. A person's view shows their own records plus the household's.

Reading corrupt or blocked storage falls back to an empty dataset rather than crashing, so
the app still runs in private-browsing modes — it just won't persist.

## PWA

The app is installable and works offline:

- `manifest.webmanifest` declares name, `standalone` display, theme colours, icons
  (including a maskable variant) and shortcuts to Today, Workouts and Meal Planner.
- `public/sw.js` precaches the app shell, serves content-hashed build assets cache-first,
  and falls back to the cached shell for navigations — so a deep link like `/progress`
  still renders with no network.
- The worker is only registered in production builds; in dev it would serve stale modules
  and fight Vite's HMR. To exercise it locally use `npm run build && npm run preview`.

Bump `VERSION` in `public/sw.js` when the shell asset list changes — old caches are dropped
on activate.

Manifest paths are relative (`./icon-192.png`, `"scope": "./"`) so they resolve against
wherever the manifest is served from. Files in `public/` are copied verbatim — Vite does not
rewrite them for `base` — so keep them relative.

## Deployment

Published to GitHub Pages at `https://sarahcrclarke.github.io/fit-and-fed/` by
`.github/workflows/deploy.yml`, which builds with Vite and publishes `dist/`.

Because it's a project site, the app is served from the `/fit-and-fed/` subpath. Three
things follow from that, and all three must agree:

- `vite.config.ts` sets `base` (override with `BASE_PATH` — the workflow passes the repo
  name). This is what prefixes every built asset URL.
- `BrowserRouter` takes `basename={import.meta.env.BASE_URL}` so routes resolve under the
  subpath rather than the domain root.
- The workflow copies `dist/index.html` to `dist/404.html`. GitHub Pages serves `404.html`
  for unknown paths, which is what makes a cold deep link like `/fit-and-fed/progress`
  boot the app. Pages returns a 404 status with it; the page itself renders correctly, and
  once the service worker is installed it serves navigations from cache instead.

**Pages must be set to "GitHub Actions" as its source** (Settings → Pages → Build and
deployment). Pointing it at a branch publishes the repository root, which is unbuilt
source — `index.html` there references `/src/main.tsx`, which no browser can execute, so
the page comes up blank.

Because `base` is set, the dev server also serves from the subpath —
`http://localhost:5173/fit-and-fed/`. Vite prints the URL on start and redirects `/` to it.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the dev server (no service worker)
- `npm run build` — type-check and build for production
- `npm run lint` — run Oxlint
- `npm run preview` — preview the production build locally, service worker included
