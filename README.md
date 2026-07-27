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
