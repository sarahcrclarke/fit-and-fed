#!/usr/bin/env node
/**
 * Fills `src/assets/recipes/` with a photograph for each meal idea.
 *
 * Run it anywhere with open network access:
 *
 *   PEXELS_API_KEY=… node scripts/fetch-recipe-photos.mjs
 *   UNSPLASH_ACCESS_KEY=… node scripts/fetch-recipe-photos.mjs --provider unsplash
 *
 * Flags:
 *   --provider pexels|unsplash   which stock library to search (default: pexels)
 *   --only <id>[,<id>…]          just these recipes
 *   --force                      re-fetch recipes that already have a photo
 *   --dry-run                    print what would be fetched, download nothing
 *
 * No image library is needed: both providers crop and compress server-side, so the script
 * asks for a square 400px JPEG and writes the bytes straight out.
 *
 * Stock search is a blunt instrument — it returns *a* photo of the dish, not a photo of
 * this household's version of it. Look at what lands before committing, and re-run with
 * `--only <id>` after editing that recipe's search term below when a result is wrong.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PHOTO_DIR = join(ROOT, 'src/assets/recipes')
const RECIPES_FILE = join(ROOT, 'src/data/recipes.ts')
const ATTRIBUTION_FILE = join(PHOTO_DIR, 'README.md')

const SIZE = 400

/**
 * What to search for, per recipe. Recipe names are how this household talks about dinner,
 * not how a stock library indexes food — "Pizza Night Dough & Sauce" finds nothing useful,
 * "homemade margherita pizza" does. Edit a line here and re-run with `--only <id>`.
 */
const SEARCH_TERMS = {
  'creamy-tuscan-chicken': 'creamy tuscan chicken spinach sun dried tomato',
  'lemon-garlic-chicken-couscous': 'lemon chicken with couscous',
  'buffalo-chicken-wraps': 'chicken wrap tortilla halves',
  'hot-honey-crispy-chicken-wraps': 'crispy chicken wrap tortilla',
  'chicken-kiev': 'chicken kiev breaded garlic butter',
  'creamy-garlic-chicken': 'creamy garlic chicken breast skillet',
  'crispy-air-fryer-chicken': 'crispy fried chicken drumsticks',
  'high-protein-chicken-pasta': 'chicken pasta creamy sauce bowl',
  'hidden-veg-chicken-traybake': 'chicken vegetable traybake roasting tin',
  'chicken-rice-meal-prep': 'chicken rice broccoli meal prep container',
  'high-protein-chilli': 'chilli con carne bowl',
  'hidden-veg-bolognese': 'spaghetti bolognese bowl',
  'loaded-beef-burrito-bowls': 'beef burrito bowl rice',
  'cottage-pie-lighter': 'cottage pie mashed potato dish',
  'beef-meatballs-tomato-sauce': 'meatballs in tomato sauce',
  'cheeseburger-bowl': 'cheeseburger salad bowl',
  'perfect-rack-of-lamb': 'rack of lamb roasted',
  'lamb-rosemary-potatoes': 'roast lamb with rosemary potatoes',
  'greek-lamb-flatbreads': 'lamb flatbread greek gyros',
  'crispy-fish-fingers-chips': 'fish fingers and chips',
  'salmon-traybake': 'salmon fillet traybake asparagus',
  'creamy-tomato-pasta': 'creamy tomato pasta bowl',
  'pesto-chicken-pasta': 'pesto pasta with chicken',
  'hidden-veg-mac-cheese': 'macaroni and cheese baking dish',
  'lasagne-lighter': 'lasagne slice layers',
  'gnocchi-bake': 'gnocchi bake tomato sauce dish',
  'crispy-chicken-tenders': 'chicken tenders with dip',
  'air-fryer-chicken-kiev': 'breaded chicken kiev sliced',
  'crispy-roast-potatoes': 'crispy roast potatoes bowl',
  'homemade-chips': 'homemade chunky chips fries',
  'air-fryer-potato-crisps': 'potato crisps chips bowl',
  'savoury-carrot-spinach-waffles': 'savoury green vegetable waffles',
  'homemade-katsu-curry-sauce': 'katsu curry sauce bowl',
  'tomato-soup': 'tomato soup bowl',
  'pizza-night-dough-sauce': 'homemade margherita pizza dough',
  'watermelon-jelly-shell': 'watermelon wedges sliced',
  lemonade: 'homemade lemonade glass',
}

function parseArgs(argv) {
  const args = { provider: 'pexels', only: null, force: false, dryRun: false }
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i]
    if (flag === '--provider') args.provider = argv[++i]
    else if (flag === '--only') args.only = new Set(argv[++i].split(','))
    else if (flag === '--force') args.force = true
    else if (flag === '--dry-run') args.dryRun = true
    else throw new Error(`Unknown flag: ${flag}`)
  }
  if (args.provider !== 'pexels' && args.provider !== 'unsplash') {
    throw new Error(`--provider must be "pexels" or "unsplash", got "${args.provider}"`)
  }
  return args
}

/** Recipe ids, read from the data file so this can never drift out of sync with it. */
function recipeIds() {
  const source = readFileSync(RECIPES_FILE, 'utf8')
  return [...source.matchAll(/^ {4}id: '([a-z0-9-]+)',$/gm)].map((m) => m[1])
}

async function existingPhotos() {
  const entries = await readdir(PHOTO_DIR).catch(() => [])
  const found = new Map()
  for (const entry of entries) {
    const match = entry.match(/^(.+)\.(jpe?g|png|webp|avif)$/i)
    if (match) found.set(match[1], entry)
  }
  return found
}

const PROVIDERS = {
  pexels: {
    envVar: 'PEXELS_API_KEY',
    async search(query, key) {
      const url = new URL('https://api.pexels.com/v1/search')
      url.searchParams.set('query', query)
      url.searchParams.set('per_page', '1')
      url.searchParams.set('orientation', 'square')
      const res = await fetch(url, { headers: { Authorization: key } })
      if (!res.ok) throw new Error(`Pexels ${res.status}: ${await res.text()}`)
      const photo = (await res.json()).photos?.[0]
      if (!photo) return null
      // Pexels crops and compresses from the URL, so no local image library is needed.
      const src = new URL(photo.src.original)
      src.searchParams.set('auto', 'compress')
      src.searchParams.set('cs', 'tinysrgb')
      src.searchParams.set('fit', 'crop')
      src.searchParams.set('w', String(SIZE))
      src.searchParams.set('h', String(SIZE))
      return {
        url: src.toString(),
        credit: photo.photographer,
        page: photo.url,
        licence: 'Pexels License',
      }
    },
  },
  unsplash: {
    envVar: 'UNSPLASH_ACCESS_KEY',
    async search(query, key) {
      const url = new URL('https://api.unsplash.com/search/photos')
      url.searchParams.set('query', query)
      url.searchParams.set('per_page', '1')
      url.searchParams.set('orientation', 'squarish')
      const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } })
      if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`)
      const photo = (await res.json()).results?.[0]
      if (!photo) return null
      const src = new URL(photo.urls.raw)
      src.searchParams.set('fit', 'crop')
      src.searchParams.set('w', String(SIZE))
      src.searchParams.set('h', String(SIZE))
      src.searchParams.set('q', '75')
      src.searchParams.set('fm', 'jpg')
      return {
        url: src.toString(),
        credit: photo.user.name,
        page: photo.links.html,
        licence: 'Unsplash License',
      }
    },
  },
}

/** Rewrites the attribution table in the folder README, keeping the prose above it. */
function writeAttribution(rows) {
  const existing = readFileSync(ATTRIBUTION_FILE, 'utf8')
  const header = existing.split('| File | Source | Licence |')[0]
  const body = rows.length
    ? rows
        .map((r) => {
          // Photos added by hand have no source page — don't render an empty link for them.
          const source = r.page ? `[${r.credit}](${r.page})` : r.credit
          return `| \`${r.file}\` | ${source} | ${r.licence} |`
        })
        .join('\n')
    : '| _(none yet)_ | | |'
  writeFileSync(
    ATTRIBUTION_FILE,
    `${header}| File | Source | Licence |\n| --- | --- | --- |\n${body}\n`,
  )
}

async function main() {
  if (!existsSync(PHOTO_DIR)) throw new Error(`Missing ${PHOTO_DIR}`)
  const args = parseArgs(process.argv.slice(2))
  const provider = PROVIDERS[args.provider]
  const key = process.env[provider.envVar]
  if (!key && !args.dryRun) {
    console.error(`Set ${provider.envVar} (or pass --dry-run).`)
    process.exit(1)
  }

  const ids = recipeIds()
  const have = await existingPhotos()
  const missingTerms = ids.filter((id) => !SEARCH_TERMS[id])
  if (missingTerms.length) {
    console.error(`No search term for: ${missingTerms.join(', ')}`)
    console.error('Add them to SEARCH_TERMS in this script.')
    process.exit(1)
  }

  const wanted = ids.filter((id) => {
    if (args.only && !args.only.has(id)) return false
    return args.force || !have.has(id)
  })

  if (!wanted.length) {
    console.log(`Nothing to do — ${have.size}/${ids.length} recipes already have a photo.`)
    return
  }

  console.log(`${wanted.length} to fetch from ${args.provider}, ${SIZE}×${SIZE}.\n`)
  const credits = []
  let failures = 0

  for (const id of wanted) {
    const query = SEARCH_TERMS[id]
    if (args.dryRun) {
      console.log(`  ${id.padEnd(34)} ← "${query}"`)
      continue
    }
    try {
      const hit = await provider.search(query, key)
      if (!hit) {
        console.warn(`  ✗ ${id.padEnd(34)} no result for "${query}"`)
        failures++
        continue
      }
      const res = await fetch(hit.url)
      if (!res.ok) throw new Error(`download ${res.status}`)
      const file = `${id}.jpg`
      const bytes = Buffer.from(await res.arrayBuffer())
      writeFileSync(join(PHOTO_DIR, file), bytes)
      credits.push({ file, ...hit })
      console.log(`  ✓ ${id.padEnd(34)} ${(bytes.length / 1024).toFixed(0)} KB — ${hit.credit}`)
    } catch (error) {
      console.warn(`  ✗ ${id.padEnd(34)} ${error.message}`)
      failures++
    }
    // Both APIs are rate limited; this keeps a full run comfortably inside the free tier.
    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  if (args.dryRun) return

  // Re-read the folder so the table covers photos added by hand as well as fetched ones.
  const now = await existingPhotos()
  const known = new Map(credits.map((c) => [c.file, c]))
  writeAttribution(
    [...now.values()]
      .sort()
      .map((file) => known.get(file) ?? { file, credit: 'added by hand', page: '', licence: '—' }),
  )

  console.log(`\nDone. ${now.size}/${ids.length} recipes have a photo.`)
  console.log('Look at them before committing — stock search picks a dish, not your dish.')
  if (failures) console.log(`${failures} failed; edit their SEARCH_TERMS and re-run with --only.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
