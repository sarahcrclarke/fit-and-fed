import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { startOfWeek, todayISO, weekDates } from '../data/dates'
import { useScopedData } from '../data/useScoped'
import { NAV_ITEMS } from './navigation'

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-100 bg-white px-4 py-6 md:flex">
      <div className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-moss-700 text-sm font-semibold text-moss-50">
          FF
        </span>
        <div>
          <p className="font-display text-lg leading-tight text-ink-900">Fit &amp; Fed</p>
          <p className="text-xs leading-tight text-ink-400">for Sarah &amp; Dom</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-moss-50 text-moss-800'
                  : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-5 w-5 shrink-0 ${isActive ? 'text-moss-600' : 'text-ink-400 group-hover:text-ink-600'}`}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <WeekSummary />
    </aside>
  )
}

function WeekSummary() {
  const { workouts, meals } = useScopedData()

  const thisWeek = useMemo(() => new Set(weekDates(startOfWeek(todayISO()))), [])
  const sessions = workouts.filter((w) => thisWeek.has(w.date))
  const done = sessions.filter((w) => w.done).length
  const plannedMeals = meals.filter((m) => thisWeek.has(m.date)).length

  const summary =
    sessions.length === 0 && plannedMeals === 0
      ? 'Plans are looking quiet — add your first workout or meal.'
      : `${done} of ${sessions.length} ${sessions.length === 1 ? 'session' : 'sessions'} done · ${plannedMeals} ${plannedMeals === 1 ? 'meal' : 'meals'} on the plan.`

  return (
    <div className="rounded-xl border border-ink-100 bg-ink-50 px-3.5 py-3">
      <p className="text-xs font-medium text-ink-500">This week</p>
      <p className="mt-0.5 text-sm text-ink-800">{summary}</p>
    </div>
  )
}
