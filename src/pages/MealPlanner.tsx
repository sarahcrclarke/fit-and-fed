import { useMemo, useState } from 'react'
import { MealSheet } from '../components/MealSheet'
import { PageHeader } from '../components/PageHeader'
import { ChevronDownIcon, PlusIcon, TrashIcon } from '../components/icons'
import { useProfile } from '../context/ProfileContext'
import {
  addDays,
  formatDayNumber,
  formatWeekdayShort,
  fromISODate,
  startOfWeek,
  todayISO,
  weekDates,
} from '../data/dates'
import { useData } from '../data/store'
import { MEAL_SLOTS, SLOT_ORDER, type Meal } from '../data/types'
import { useScopedData } from '../data/useScoped'

const monthName = new Intl.DateTimeFormat('en-GB', { month: 'long' })

export function MealPlanner() {
  const { activeProfile } = useProfile()
  const { meals } = useScopedData()
  const { removeMeal } = useData()
  const [weekAnchor, setWeekAnchor] = useState(() => startOfWeek(todayISO()))
  const [sheetDate, setSheetDate] = useState<string | null>(null)

  const days = useMemo(() => weekDates(weekAnchor), [weekAnchor])
  const today = todayISO()

  const byDay = useMemo(() => {
    const map = new Map<string, Meal[]>()
    for (const day of days) map.set(day, [])
    for (const meal of meals) {
      const bucket = map.get(meal.date)
      if (bucket) bucket.push(meal)
    }
    for (const bucket of map.values()) bucket.sort((a, b) => SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot])
    return map
  }, [meals, days])

  const weekMeals = days.flatMap((day) => byDay.get(day) ?? [])
  const isCurrentWeek = weekAnchor === startOfWeek(today)

  const weekLabel = isCurrentWeek
    ? 'This week'
    : `Week of ${formatDayNumber(weekAnchor)} ${monthName.format(fromISODate(weekAnchor))}`

  return (
    <div>
      <PageHeader
        eyebrow="Nutrition"
        title="Meal Planner"
        description="Plan meals across the week for the household and keep everyone's shopping list in sync."
        action={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous week"
              onClick={() => setWeekAnchor((w) => addDays(w, -7))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-500 transition hover:border-ink-300 hover:text-ink-800"
            >
              <ChevronDownIcon className="h-4 w-4 rotate-90" />
            </button>
            <span className="min-w-28 text-center text-xs font-medium text-ink-500">{weekLabel}</span>
            <button
              type="button"
              aria-label="Next week"
              onClick={() => setWeekAnchor((w) => addDays(w, 7))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-500 transition hover:border-ink-300 hover:text-ink-800"
            >
              <ChevronDownIcon className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        }
      />

      <div className="grid gap-2.5 sm:grid-cols-7 sm:gap-2">
        {days.map((day) => {
          const dayMeals = byDay.get(day) ?? []
          const isToday = day === today
          return (
            <div
              key={day}
              className={`flex flex-col rounded-2xl border p-2.5 transition sm:min-h-32 ${
                isToday ? 'border-moss-300 bg-moss-50/70' : 'border-ink-100 bg-white/70'
              }`}
            >
              <div className="mb-2 flex items-baseline justify-between gap-1">
                <span
                  className={`text-xs font-semibold uppercase ${isToday ? 'text-moss-700' : 'text-ink-400'}`}
                >
                  {formatWeekdayShort(day)}
                </span>
                <span className={`text-xs ${isToday ? 'text-moss-600' : 'text-ink-300'}`}>
                  {formatDayNumber(day)}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-1.5">
                {dayMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="group rounded-lg bg-white px-2 py-1.5 text-left shadow-card ring-1 ring-ink-100"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="min-w-0 flex-1 break-words text-[11px] font-medium leading-snug text-ink-800">
                        {meal.name}
                      </p>
                      <button
                        type="button"
                        aria-label={`Remove ${meal.name}`}
                        onClick={() => removeMeal(meal.id)}
                        className="shrink-0 text-ink-300 transition hover:text-clay-600"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-clay-600">
                      {MEAL_SLOTS.find((s) => s.id === meal.slot)?.label}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSheetDate(day)}
                className="mt-2 flex items-center justify-center gap-1 rounded-lg border border-dashed border-ink-200 py-1.5 text-[11px] font-medium text-ink-400 transition hover:border-moss-400 hover:text-moss-700"
              >
                <PlusIcon className="h-3 w-3" /> Add
              </button>
            </div>
          )
        })}
      </div>

      <section className="mt-6 rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-lg text-ink-900">Shopping list</h2>
          <span className="text-xs text-ink-400">
            {weekMeals.length} {weekMeals.length === 1 ? 'meal' : 'meals'} planned
          </span>
        </div>
        {weekMeals.length === 0 ? (
          <p className="mt-2 text-sm text-ink-500">
            Add meals to any day above and they'll gather here as a list to shop from.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {weekMeals.map((meal) => (
              <li key={meal.id} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-400" />
                <span className="text-ink-800">{meal.name}</span>
                {meal.notes && <span className="text-ink-400">— {meal.notes}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-3 px-1 text-xs text-ink-400">
        Planning as <span className="font-medium text-ink-600">{activeProfile.name}</span>.
      </p>

      <MealSheet
        open={sheetDate !== null}
        onClose={() => setSheetDate(null)}
        defaultDate={sheetDate ?? undefined}
        defaultSlot="dinner"
        planned
      />
    </div>
  )
}
