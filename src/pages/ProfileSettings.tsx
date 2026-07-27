import { useState, type ComponentType, type SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import { TextInput } from '../components/fields'
import { TrashIcon } from '../components/icons'
import { PROFILES, useProfile } from '../context/ProfileContext'
import { startOfWeek, todayISO, weekDates } from '../data/dates'
import { useData } from '../data/store'
import { useScopedData } from '../data/useScoped'

function ChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8.2" r="3.5" />
      <path d="M4.8 19.5a7.2 7.2 0 0 1 14.4 0" />
    </svg>
  )
}

function GoalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function RulerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 7v3M11 7v3M15 7v3" />
    </svg>
  )
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

function HouseholdIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.5h12V10" />
    </svg>
  )
}

interface SettingRow {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  value: string
  /** Rows without a destination render as plain text — no chevron, nothing to click. */
  to?: string
}

export function ProfileSettings() {
  const { activeProfile } = useProfile()
  const { data, setGoals, clearAll } = useData()
  const { workouts, meals, goals } = useScopedData()
  const [confirmingReset, setConfirmingReset] = useState(false)

  const weeklyTarget = goals.workoutsPerWeek
  const thisWeek = new Set(weekDates(startOfWeek(todayISO())))
  const weekSessions = workouts.filter((w) => thisWeek.has(w.date) && w.done).length

  const personalRows: SettingRow[] = [
    { icon: UserIcon, label: 'Personal details', value: activeProfile.name },
    {
      icon: GoalIcon,
      label: 'Focus areas',
      value: goals.focusAreas.length > 0 ? `${goals.focusAreas.length} chosen` : 'Not set',
      to: '/body-focus',
    },
    { icon: RulerIcon, label: 'Units & measurements', value: 'Metric' },
    { icon: BellIcon, label: 'Notifications', value: 'Default' },
  ]

  const householdRows: SettingRow[] = [
    { icon: HouseholdIcon, label: 'Household members', value: `${PROFILES.length - 1} people` },
    {
      icon: GoalIcon,
      label: 'Records stored',
      value: `${data.workouts.length + data.meals.length} total`,
    },
  ]

  const title = activeProfile.id === 'household' ? 'Household Settings' : `${activeProfile.name}'s Profile`

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title={title}
        description="Manage personal details, goals and preferences, plus shared household settings."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-moss-700 text-lg font-semibold text-moss-50">
              {activeProfile.initials}
            </span>
            <div>
              <p className="font-display text-lg text-ink-900">{activeProfile.name}</p>
              <p className="text-sm text-ink-400">{activeProfile.tagline}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="font-display text-lg text-ink-900">Weekly training goal</p>
                <p className="mt-0.5 text-sm text-ink-400">
                  {weeklyTarget
                    ? `${weekSessions} of ${weeklyTarget} sessions done this week.`
                    : 'Set a number of sessions to aim for each week.'}
                </p>
              </div>
              <div className="w-24">
                <TextInput
                  type="number"
                  min={0}
                  max={14}
                  inputMode="numeric"
                  aria-label="Sessions per week"
                  value={weeklyTarget ?? ''}
                  placeholder="—"
                  onChange={(e) => {
                    const next = Number.parseInt(e.target.value, 10)
                    setGoals(activeProfile.id, {
                      workoutsPerWeek: Number.isFinite(next) && next > 0 ? next : undefined,
                    })
                  }}
                />
              </div>
            </div>
            {weeklyTarget ? (
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-moss-600 transition-all"
                  style={{ width: `${Math.min(100, Math.round((weekSessions / weeklyTarget) * 100))}%` }}
                />
              </div>
            ) : null}
          </div>

          <SettingsList title="Personal" rows={personalRows} />
          <SettingsList title="Household" rows={householdRows} />

          <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
            <p className="font-display text-lg text-ink-900">Your data</p>
            <p className="mt-0.5 text-sm text-ink-400">
              Everything is stored on this device only — {workouts.length}{' '}
              {workouts.length === 1 ? 'workout' : 'workouts'} and {meals.length}{' '}
              {meals.length === 1 ? 'meal' : 'meals'} in this view.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {confirmingReset ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      clearAll()
                      setConfirmingReset(false)
                    }}
                  >
                    Yes, delete everything
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmingReset(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="danger" size="sm" onClick={() => setConfirmingReset(true)}>
                  <TrashIcon className="h-3.5 w-3.5" /> Reset all data
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">People</p>
          <ul className="mt-3 flex flex-col gap-3">
            {PROFILES.map((profile) => (
              <li key={profile.id} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-sm font-semibold text-ink-600">
                  {profile.initials}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink-800">{profile.name}</p>
                  <p className="text-xs text-ink-400">{profile.tagline}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}

function SettingsList({ title, rows }: { title: string; rows: SettingRow[] }) {
  return (
    <div className="mt-6">
      <p className="px-1 text-xs font-semibold uppercase tracking-wide text-ink-400">{title}</p>
      <div className="mt-2 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
        {rows.map((row, i) => {
          const divider = i !== rows.length - 1 ? 'border-b border-ink-100' : ''
          const body = (
            <>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-500">
                <row.icon className="h-[18px] w-[18px]" />
              </span>
              <span className="flex-1 text-sm font-medium text-ink-800">{row.label}</span>
              <span className="text-sm text-ink-400">{row.value}</span>
              {row.to && <ChevronRight className="h-4 w-4 text-ink-300" />}
            </>
          )

          return row.to ? (
            <Link
              key={row.label}
              to={row.to}
              className={`flex items-center gap-3.5 px-4 py-3.5 transition hover:bg-ink-50 ${divider}`}
            >
              {body}
            </Link>
          ) : (
            <div key={row.label} className={`flex items-center gap-3.5 px-4 py-3.5 ${divider}`}>
              {body}
            </div>
          )
        })}
      </div>
    </div>
  )
}
