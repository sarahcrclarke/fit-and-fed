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
- `src/components` — shared UI (page headers, empty states, summary cards, icons)

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run lint` — run Oxlint
- `npm run preview` — preview the production build locally
