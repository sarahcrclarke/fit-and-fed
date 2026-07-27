import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { WorkoutSheet } from '../components/WorkoutSheet'
import { SegmentedControl } from '../components/fields'
import { PlusIcon, WorkoutsIcon } from '../components/icons'
import { WorkoutRow } from '../components/records'
import { useProfile } from '../context/ProfileContext'
import { formatDayRelative, formatDuration, todayISO } from '../data/dates'
import { useData } from '../data/store'
import { WORKOUT_TYPES, type WorkoutType } from '../data/types'
import { groupByDate, useScopedData } from '../data/useScoped'

type Filter = 'all' | WorkoutType

const FILTERS: { id: Filter; label: string }[] = [{ id: 'all', label: 'All' }, ...WORKOUT_TYPES]

export function Workouts() {
  const { activeProfile } = useProfile()
  const { workouts } = useScopedData()
  const { updateWorkout, removeWorkout } = useData()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')

  const description =
    activeProfile.id === 'household'
      ? 'Strength, cardio and mobility sessions for the household, all in one place.'
      : `Strength, cardio and mobility sessions for ${activeProfile.name}.`

  const visible = useMemo(
    () => (filter === 'all' ? workouts : workouts.filter((w) => w.type === filter)),
    [workouts, filter],
  )

  // Newest day first, so recent training is at the top of the page.
  const grouped = useMemo(
    () => groupByDate(visible).sort(([a], [b]) => b.localeCompare(a)),
    [visible],
  )

  const totalMinutes = visible.reduce((sum, w) => sum + w.durationMin, 0)
  const showOwner = activeProfile.id === 'household'

  return (
    <div>
      <PageHeader
        eyebrow="Training"
        title="Workouts"
        description={description}
        action={
          <Button onClick={() => setSheetOpen(true)}>
            <PlusIcon className="h-4 w-4" /> Add workout
          </Button>
        }
      />

      {workouts.length === 0 ? (
        <EmptyState
          icon={WorkoutsIcon}
          title="No workouts yet"
          body="Sessions you plan or log will be listed here, organised by day, so you can see training history at a glance."
          action={
            <Button onClick={() => setSheetOpen(true)}>
              <PlusIcon className="h-4 w-4" /> Add your first workout
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5">
            <div className="w-full max-w-sm">
              <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} label="Filter by type" />
            </div>
            <p className="text-xs text-ink-400">
              {visible.length} {visible.length === 1 ? 'session' : 'sessions'} ·{' '}
              {formatDuration(totalMinutes)}
            </p>
          </div>

          {grouped.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink-200 bg-white/50 px-4 py-10 text-center text-sm text-ink-400">
              No {filter} sessions logged.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {grouped.map(([date, items]) => (
                <section key={date}>
                  <div className="mb-2.5 flex items-baseline justify-between px-1">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                      {formatDayRelative(date)}
                    </h2>
                    {date > todayISO() && (
                      <span className="text-[11px] font-medium text-gold-700">Upcoming</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {items.map((workout) => (
                      <WorkoutRow
                        key={workout.id}
                        workout={workout}
                        showOwner={showOwner}
                        onToggleDone={() => updateWorkout(workout.id, { done: !workout.done })}
                        onRemove={() => removeWorkout(workout.id)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}

      <WorkoutSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
