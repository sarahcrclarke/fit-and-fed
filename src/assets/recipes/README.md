# Meal idea photos

Drop a photograph in here named after the recipe's `id` in `src/data/recipes.ts` and it
becomes that meal's picture — `salmon-traybake.jpg` lights up the Salmon Traybake. No code
or data changes are needed: `src/data/recipePhotos.ts` resolves this folder at build time.

A recipe with no file here falls back to its drawing in `RecipeImage.tsx`, so the list is
never blank while photos are still being collected.

## What to put here

- **Name**: exactly the recipe `id`, lowercase, hyphenated. Run
  `node -e "console.log(require('fs').readFileSync('src/data/recipes.ts','utf8').match(/id: '[a-z0-9-]+'/g).join('\n'))"`
  for the full list.
- **Format**: `.webp` preferred, `.jpg` fine. `.png` and `.avif` also resolve.
- **Shape**: square. The thumbnail is rendered with `object-cover`, so a non-square photo
  is centre-cropped rather than squashed — but cropping in advance gives a better result.
- **Size**: 400 × 400 is plenty for the thumbnail at 2× density. Keep each file under
  ~40 KB; the app is installable offline, so every photo is weight someone downloads.

## Fetching a starter set

`scripts/fetch-recipe-photos.mjs` fills this folder from a stock library, cropped square
and compressed, and writes the attribution table below:

```bash
PEXELS_API_KEY=… node scripts/fetch-recipe-photos.mjs           # or --provider unsplash
node scripts/fetch-recipe-photos.mjs --dry-run                  # see the search terms first
node scripts/fetch-recipe-photos.mjs --only salmon-traybake --force
```

Stock search returns *a* photo of the dish, not a photo of this household's version of it,
so look at the results before committing them. When one is wrong, edit that recipe's line
in `SEARCH_TERMS` at the top of the script and re-run with `--only`.

## Licensing

These files ship inside a published web app. Only add photos that are yours, or that carry
a licence permitting redistribution. If a licence requires attribution, add the credit line
to this file next to the filename so it stays with the image.

| File | Source | Licence |
| --- | --- | --- |
| _(none yet)_ | | |
