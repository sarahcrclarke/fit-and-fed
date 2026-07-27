import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { MealSheet } from '../components/MealSheet'
import { PageHeader } from '../components/PageHeader'
import { RecipeBrowser } from '../components/RecipeBrowser'
import { SegmentedControl } from '../components/fields'
import { MealsIcon, PlusIcon } from '../components/icons'
import { MealRow } from '../components/records'
import { useProfile } from '../context/ProfileContext'
import { formatDayRelative, todayISO } from '../data/dates'
import type { Recipe } from '../data/recipes'
import { useData } from '../data/store'
import { groupByDate, useScopedData } from '../data/useScoped'

type Tab = 'log' | 'ideas'

const TABS: { id: Tab; label: string }[] = [
  { id: 'log', label: 'Logged' },
  { id: 'ideas', label: 'Ideas' },
]

export function Meals() {
  const { activeProfile } = useProfile()
  const { meals } = useScopedData()
  const { updateMeal, removeMeal } = useData()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [preset, setPreset] = useState<Recipe | undefined>(undefined)
  const [tab, setTab] = useState<Tab>('log')

  const description =
    activeProfile.id === 'household'
      ? 'Breakfast, lunch, dinner and snacks logged across the household.'
      : `Breakfast, lunch, dinner and snacks logged for ${activeProfile.name}.`

  const grouped = useMemo(() => groupByDate(meals).sort(([a], [b]) => b.localeCompare(a)), [meals])
  const showOwner = activeProfile.id === 'household'
  const today = todayISO()

  function openBlank() {
    setPreset(undefined)
    setSheetOpen(true)
  }

  function openWith(recipe: Recipe) {
    setPreset(recipe)
    setSheetOpen(true)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Nutrition"
        title="Meals"
        description={description}
        action={
          <Button onClick={openBlank}>
            <PlusIcon className="h-4 w-4" /> Log meal
          </Button>
        }
      />

      <div className="max-w-xs pb-5">
        <SegmentedControl options={TABS} value={tab} onChange={setTab} label="Meals view" />
      </div>

      {tab === 'ideas' ? (
        <RecipeBrowser actionLabel="Log" onPick={openWith} />
      ) : meals.length === 0 ? (
        <EmptyState
          icon={MealsIcon}
          title="No meals logged yet"
          body="Log a meal to start building a food history — or browse the meal ideas for something to cook."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={openBlank}>
                <PlusIcon className="h-4 w-4" /> Log your first meal
              </Button>
              <Button variant="secondary" onClick={() => setTab('ideas')}>
                Browse meal ideas
              </Button>
            </div>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([date, items]) => {
            const dayCalories = items.reduce((sum, m) => sum + (m.calories ?? 0), 0)
            return (
              <section key={date}>
                <div className="mb-2.5 flex items-baseline justify-between px-1">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    {formatDayRelative(date)}
                    {date > today && <span className="ml-2 text-gold-700">Planned</span>}
                  </h2>
                  {dayCalories > 0 && (
                    <span className="text-[11px] font-medium text-ink-400">{dayCalories} kcal</span>
                  )}
                </div>
                <div className="flex flex-col gap-2.5">
                  {items.map((meal) => (
                    <MealRow
                      key={meal.id}
                      meal={meal}
                      showOwner={showOwner}
                      onToggleEaten={() => updateMeal(meal.id, { planned: !meal.planned })}
                      onRemove={() => removeMeal(meal.id)}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <MealSheet open={sheetOpen} onClose={() => setSheetOpen(false)} preset={preset} />
    </div>
  )
}
