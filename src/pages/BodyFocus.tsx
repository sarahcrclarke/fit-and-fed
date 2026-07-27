import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import { WorkoutSheet } from '../components/WorkoutSheet'
import { ChipGroup } from '../components/fields'
import { BodyFocusIcon, PlusIcon } from '../components/icons'
import { useProfile } from '../context/ProfileContext'
import { startOfWeek, todayISO, weekDates } from '../data/dates'
import { useData } from '../data/store'
import { BODY_AREAS, type BodyArea } from '../data/types'
import { useScopedData } from '../data/useScoped'

export function BodyFocus() {
  const { activeProfile } = useProfile()
  const { workouts, goals } = useScopedData()
  const { setGoals } = useData()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetAreas, setSheetAreas] = useState<BodyArea[]>([])

  const thisWeek = useMemo(() => new Set(weekDates(startOfWeek(todayISO()))), [])

  /** Minutes of training this week per body area, from the areas tagged on each workout. */
  const minutesByArea = useMemo(() => {
    const totals = new Map<BodyArea, number>()
    for (const workout of workouts) {
      if (!thisWeek.has(workout.date)) continue
      for (const area of workout.areas) {
        totals.set(area, (totals.get(area) ?? 0) + workout.durationMin)
      }
    }
    return totals
  }, [workouts, thisWeek])

  const maxMinutes = Math.max(1, ...minutesByArea.values())
  const selected = goals.focusAreas
  const untouched = selected.filter((area) => !minutesByArea.has(area))

  function toggleArea(area: BodyArea) {
    const next = selected.includes(area)
      ? selected.filter((a) => a !== area)
      : [...selected, area]
    setGoals(activeProfile.id, { focusAreas: next })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Training"
        title="Body Focus"
        description="Choose the muscle groups and movement patterns to prioritise this week, and see how attention is spread across the body."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card lg:col-span-2">
          <h2 className="font-display text-lg text-ink-900">Priorities</h2>
          <p className="mt-1 text-sm text-ink-500">
            Pick the areas {activeProfile.id === 'household' ? 'the household is' : `${activeProfile.name} is`}{' '}
            prioritising. These are saved as you tap.
          </p>
          <div className="mt-4">
            <ChipGroup
              label="Focus areas"
              options={BODY_AREAS}
              selected={selected}
              onToggle={toggleArea}
            />
          </div>
          {selected.length === 0 && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-ink-50 px-3.5 py-3 text-xs text-ink-500">
              <BodyFocusIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
              Nothing chosen yet — pick an area above and this week's coverage will be measured against it.
            </p>
          )}
          {untouched.length > 0 && (
            <p className="mt-4 rounded-xl bg-clay-50 px-3.5 py-3 text-xs text-clay-600">
              No training logged this week for{' '}
              {untouched.map((a) => BODY_AREAS.find((b) => b.id === a)?.label).join(', ')}.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card lg:col-span-3">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-lg text-ink-900">This week's coverage</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSheetAreas(selected)
                setSheetOpen(true)
              }}
            >
              <PlusIcon className="h-3.5 w-3.5" /> Workout
            </Button>
          </div>

          {minutesByArea.size === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center text-sm text-ink-400">
              Tag focus areas on a workout and the spread across the body shows up here.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {BODY_AREAS.map((area) => {
                const minutes = minutesByArea.get(area.id) ?? 0
                const isPriority = selected.includes(area.id)
                return (
                  <li key={area.id}>
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span
                        className={`text-xs font-medium ${isPriority ? 'text-moss-700' : 'text-ink-500'}`}
                      >
                        {area.label}
                        {isPriority && <span className="ml-1.5 text-moss-500">•</span>}
                      </span>
                      <span className="text-xs text-ink-400">
                        {minutes > 0 ? `${minutes} min` : '—'}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                      <div
                        className={`h-full rounded-full transition-all ${isPriority ? 'bg-moss-600' : 'bg-ink-300'}`}
                        style={{ width: `${Math.round((minutes / maxMinutes) * 100)}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      <WorkoutSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        defaultAreas={sheetAreas}
      />
    </div>
  )
}
