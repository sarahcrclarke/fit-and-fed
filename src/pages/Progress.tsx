import { useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { SummaryCard } from '../components/SummaryCard'
import { SegmentedControl } from '../components/fields'
import { FlameIcon, MealsIcon, ProgressIcon, WorkoutsIcon } from '../components/icons'
import { useProfile } from '../context/ProfileContext'
import {
  formatDayRelative,
  formatDuration,
  formatWeekdayShort,
  recentDates,
  startOfWeek,
  todayISO,
  weekDates,
} from '../data/dates'
import { useScopedData } from '../data/useScoped'

type Range = '14' | '30'

const RANGES: { id: Range; label: string }[] = [
  { id: '14', label: 'Last 14 days' },
  { id: '30', label: 'Last 30 days' },
]

export function Progress() {
  const { activeProfile } = useProfile()
  const { workouts, meals } = useScopedData()
  const [range, setRange] = useState<Range>('14')

  const description =
    activeProfile.id === 'household'
      ? 'Trends across training and nutrition for the household over time.'
      : `Trends across training, nutrition and body metrics for ${activeProfile.name} over time.`

  const days = useMemo(() => recentDates(Number(range)), [range])

  /** Completed training minutes per day across the selected range. */
  const series = useMemo(() => {
    const totals = new Map<string, number>()
    for (const workout of workouts) {
      if (!workout.done) continue
      totals.set(workout.date, (totals.get(workout.date) ?? 0) + workout.durationMin)
    }
    return days.map((date) => ({ date, minutes: totals.get(date) ?? 0 }))
  }, [workouts, days])

  const thisWeek = useMemo(() => new Set(weekDates(startOfWeek(todayISO()))), [])
  const weekWorkouts = workouts.filter((w) => thisWeek.has(w.date) && w.done)
  const weekMinutes = weekWorkouts.reduce((sum, w) => sum + w.durationMin, 0)
  const mealsLogged = meals.filter((m) => !m.planned).length

  /** Consecutive days up to today with at least one completed workout. */
  const streak = useMemo(() => {
    const trained = new Set(series.filter((d) => d.minutes > 0).map((d) => d.date))
    let count = 0
    for (let i = series.length - 1; i >= 0; i -= 1) {
      if (!trained.has(series[i].date)) break
      count += 1
    }
    return count
  }, [series])

  const hasData = workouts.length > 0 || meals.length > 0

  if (!hasData) {
    return (
      <div>
        <PageHeader eyebrow="Progress" title="Progress" description={description} />
        <EmptyState
          icon={ProgressIcon}
          title="Not enough data yet"
          body="Log a few workouts and meals and trends will build up here — weekly training load, streaks and how the week compares."
        />
      </div>
    )
  }

  const peak = Math.max(...series.map((d) => d.minutes))

  return (
    <div>
      <PageHeader eyebrow="Progress" title="Progress" description={description} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          icon={WorkoutsIcon}
          label="Sessions this week"
          value={String(weekWorkouts.length)}
          tone="moss"
        />
        <SummaryCard
          icon={ProgressIcon}
          label="Training this week"
          value={weekMinutes > 0 ? formatDuration(weekMinutes) : '—'}
        />
        <SummaryCard
          icon={FlameIcon}
          label="Current streak"
          value={streak > 0 ? `${streak} ${streak === 1 ? 'day' : 'days'}` : 'None'}
          tone="clay"
        />
        <SummaryCard icon={MealsIcon} label="Meals logged" value={String(mealsLogged)} />
      </div>

      <section className="mt-6 rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-ink-900">Training minutes per day</h2>
            <p className="mt-0.5 text-xs text-ink-400">
              Completed sessions only. Peak {peak > 0 ? formatDuration(peak) : '0 min'}.
            </p>
          </div>
          <div className="w-full max-w-56">
            <SegmentedControl options={RANGES} value={range} onChange={setRange} label="Date range" />
          </div>
        </div>

        {peak === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center text-sm text-ink-400">
            No completed sessions in this range. Tick a workout off and it'll chart here.
          </p>
        ) : (
          <BarChart series={series} peak={peak} />
        )}
      </section>
    </div>
  )
}

function BarChart({
  series,
  peak,
}: {
  series: { date: string; minutes: number }[]
  peak: number
}) {
  // Single series, so identity needs no legend — the section heading names it. Values live in
  // the hover tooltip and in screen-reader text rather than being stamped on every bar.
  return (
    <div className="mt-5">
      <ol className="flex h-44 items-end gap-[3px]" aria-label="Training minutes per day">
        {series.map(({ date, minutes }) => {
          const height = Math.max(minutes > 0 ? 3 : 1.5, (minutes / peak) * 100)
          return (
            <li key={date} className="group relative flex h-full flex-1 flex-col justify-end">
              <div
                className={`w-full rounded-t transition-colors ${
                  minutes > 0 ? 'bg-moss-500 group-hover:bg-moss-700' : 'bg-ink-100'
                }`}
                style={{ height: `${height}%` }}
              />
              <span className="sr-only">
                {formatDayRelative(date)}: {minutes > 0 ? formatDuration(minutes) : 'no training'}
              </span>
              <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-card-hover group-hover:block"
              >
                {formatDayRelative(date)} ·{' '}
                {minutes > 0 ? formatDuration(minutes) : 'rest'}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-2 flex gap-[3px] border-t border-ink-100 pt-2">
        {series.map(({ date }, i) => (
          <span
            key={date}
            className="flex-1 overflow-hidden text-center text-[10px] text-ink-300"
            aria-hidden="true"
          >
            {/* Label every other day so ticks never collide at 30-day range. */}
            {i % (series.length > 20 ? 4 : 2) === 0 ? formatWeekdayShort(date).slice(0, 1) : ''}
          </span>
        ))}
      </div>
    </div>
  )
}
