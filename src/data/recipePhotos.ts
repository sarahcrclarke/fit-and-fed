/**
 * Photographs of the meal ideas.
 *
 * A recipe gets a photo by dropping an image file into `src/assets/recipes/` named after
 * the recipe's `id` — `salmon-traybake.jpg` lights up the Salmon Traybake. Nothing else
 * needs editing: Vite resolves the folder at build time, so the file appears in the
 * bundle content-hashed, and the service worker caches it on first use like any other
 * build asset.
 *
 * Recipes with no photo file fall back to the drawing in `RecipeImage`, so the list is
 * never blank while the photos are still being collected.
 */

const files = import.meta.glob('../assets/recipes/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const PHOTOS: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  const filename = path.split('/').pop()
  if (!filename) continue
  PHOTOS[filename.replace(/\.[^.]+$/, '')] = url
}

export function recipePhoto(id: string): string | undefined {
  return PHOTOS[id]
}

/** How many meal ideas currently have a photograph rather than a drawing. */
export function photoCount(): number {
  return Object.keys(PHOTOS).length
}
