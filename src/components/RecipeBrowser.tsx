import { useMemo, useState, type ReactNode } from 'react'
import {
  KIND_LABELS,
  RECIPES,
  RECIPE_CATEGORIES,
  RECIPE_TAGS,
  type Recipe,
  type RecipeCategory,
  type RecipeTag,
} from '../data/recipes'
import { RecipeImage } from './RecipeImage'
import { TextInput } from './fields'

const TAG_STYLES: Record<RecipeTag, string> = {
  'kid-friendly': 'bg-moss-100 text-moss-800',
  'high-protein': 'bg-ink-100 text-ink-600',
  'hidden-veg': 'bg-moss-100 text-moss-800',
  'air-fryer': 'bg-ink-100 text-ink-600',
  'low-calorie': 'bg-gold-100 text-gold-700',
  seafood: 'bg-clay-100 text-clay-600',
}

/**
 * Searchable list of the household's meal ideas. `onPick` receives the chosen recipe —
 * callers decide whether that means logging it, planning it, or filling a form.
 */
export function RecipeBrowser({
  onPick,
  actionLabel = 'Add',
}: {
  onPick: (recipe: Recipe) => void
  actionLabel?: string
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<RecipeCategory | 'all'>('all')
  const [tags, setTags] = useState<RecipeTag[]>([])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RECIPES.filter((recipe) => {
      if (category !== 'all' && recipe.category !== category) return false
      if (tags.some((tag) => !recipe.tags.includes(tag))) return false
      if (!q) return true
      return (
        recipe.name.toLowerCase().includes(q) || (recipe.note?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [query, category, tags])

  function toggleTag(tag: RecipeTag) {
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    )
  }

  return (
    <div>
      <TextInput
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search meals…"
        aria-label="Search meals"
      />

      <div className="mt-3 flex flex-wrap gap-1.5">
        <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
          All
        </FilterChip>
        {RECIPE_CATEGORIES.map((c) => (
          <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
            {c.label}
          </FilterChip>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {RECIPE_TAGS.map((t) => (
          <FilterChip key={t.id} active={tags.includes(t.id)} onClick={() => toggleTag(t.id)} subtle>
            {t.label}
          </FilterChip>
        ))}
      </div>

      <p className="mt-3 px-1 text-xs text-ink-400">
        {results.length} {results.length === 1 ? 'meal' : 'meals'} · calories are approximate per
        serving
      </p>

      {results.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-ink-200 px-4 py-10 text-center text-sm text-ink-400">
          Nothing matches those filters.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {results.map((recipe) => (
            <li
              key={recipe.id}
              className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-3 shadow-card"
            >
              <RecipeImage
                recipe={recipe}
                className="h-16 w-16 shrink-0 rounded-xl ring-1 ring-ink-100 sm:h-20 sm:w-20"
              />
              <div className="min-w-0 flex-1 py-0.5">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <p className="text-sm font-medium text-ink-900">{recipe.name}</p>
                  {recipe.kind !== 'main' && (
                    <span className="text-[11px] text-ink-400">{KIND_LABELS[recipe.kind]}</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs font-medium text-clay-600">{recipe.calories} kcal</p>
                {recipe.note && (
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">{recipe.note}</p>
                )}
                {recipe.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TAG_STYLES[tag]}`}
                      >
                        {RECIPE_TAGS.find((t) => t.id === tag)?.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => onPick(recipe)}
                className="shrink-0 rounded-full bg-moss-700 px-3 py-1.5 text-xs font-medium text-moss-50 transition hover:bg-moss-800"
              >
                {actionLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  subtle = false,
  children,
}: {
  active: boolean
  onClick: () => void
  subtle?: boolean
  children: ReactNode
}) {
  const base = 'rounded-full border px-3 py-1.5 text-xs font-medium transition'
  if (active) {
    return (
      <button
        type="button"
        aria-pressed
        onClick={onClick}
        className={`${base} border-moss-600 bg-moss-600 text-white`}
      >
        {children}
      </button>
    )
  }
  return (
    <button
      type="button"
      aria-pressed={false}
      onClick={onClick}
      className={`${base} border-ink-200 bg-white ${subtle ? 'text-ink-400' : 'text-ink-500'} hover:border-ink-300 hover:text-ink-800`}
    >
      {children}
    </button>
  )
}
