import type { ReactNode } from 'react'
import { PROFILES, type ProfileId } from '../context/ProfileContext'
import { formatDuration } from '../data/dates'
import { BODY_AREAS, MEAL_SLOTS, WORKOUT_TYPES, type Meal, type Workout } from '../data/types'
import { CheckCircleIcon, ClockIcon, TrashIcon } from './icons'

function ownerName(id: ProfileId): string {
  return PROFILES.find((p) => p.id === id)?.name ?? 'Household'
}

function areaLabels(areas: Workout['areas']): string {
  return areas
    .map((area) => BODY_AREAS.find((a) => a.id === area)?.label ?? area)
    .join(' · ')
}

function OwnerBadge({ profileId }: { profileId: ProfileId }) {
  return (
    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-500">
      {ownerName(profileId)}
    </span>
  )
}

function RecordShell({
  children,
  done,
}: {
  children: ReactNode
  done: boolean
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition ${
        done ? 'border-moss-200 bg-moss-50/60' : 'border-ink-100 bg-white shadow-card'
      }`}
    >
      {children}
    </div>
  )
}

function DoneToggle({
  done,
  onToggle,
  label,
}: {
  done: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      aria-label={label}
      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
        done
          ? 'border-moss-600 bg-moss-600 text-white'
          : 'border-ink-200 text-transparent hover:border-moss-400 hover:text-moss-300'
      }`}
    >
      <CheckCircleIcon className="h-4 w-4" />
    </button>
  )
}

function RemoveButton({ onRemove, label }: { onRemove: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={label}
      className="shrink-0 rounded-full p-1.5 text-ink-300 transition hover:bg-clay-50 hover:text-clay-600"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  )
}

export function WorkoutRow({
  workout,
  onToggleDone,
  onRemove,
  showOwner = false,
}: {
  workout: Workout
  onToggleDone: () => void
  onRemove: () => void
  showOwner?: boolean
}) {
  const typeLabel = WORKOUT_TYPES.find((t) => t.id === workout.type)?.label ?? workout.type

  return (
    <RecordShell done={workout.done}>
      <DoneToggle
        done={workout.done}
        onToggle={onToggleDone}
        label={workout.done ? `Mark ${workout.name} as not done` : `Mark ${workout.name} as done`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p
            className={`text-sm font-medium ${workout.done ? 'text-moss-800' : 'text-ink-900'}`}
          >
            {workout.name}
          </p>
          {showOwner && <OwnerBadge profileId={workout.profileId} />}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-400">
          <span className="font-medium text-moss-600">{typeLabel}</span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            {formatDuration(workout.durationMin)}
          </span>
          {workout.areas.length > 0 && <span>{areaLabels(workout.areas)}</span>}
        </div>
        {workout.notes && <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{workout.notes}</p>}
      </div>
      <RemoveButton onRemove={onRemove} label={`Delete ${workout.name}`} />
    </RecordShell>
  )
}

export function MealRow({
  meal,
  onToggleEaten,
  onRemove,
  showOwner = false,
}: {
  meal: Meal
  onToggleEaten: () => void
  onRemove: () => void
  showOwner?: boolean
}) {
  const slotLabel = MEAL_SLOTS.find((s) => s.id === meal.slot)?.label ?? meal.slot
  const eaten = !meal.planned

  return (
    <RecordShell done={eaten}>
      <DoneToggle
        done={eaten}
        onToggle={onToggleEaten}
        label={eaten ? `Move ${meal.name} back to planned` : `Mark ${meal.name} as eaten`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className={`text-sm font-medium ${eaten ? 'text-moss-800' : 'text-ink-900'}`}>
            {meal.name}
          </p>
          {showOwner && <OwnerBadge profileId={meal.profileId} />}
          {meal.planned && (
            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-medium text-gold-700">
              Planned
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-400">
          <span className="font-medium text-clay-600">{slotLabel}</span>
          {typeof meal.calories === 'number' && <span>{meal.calories} kcal</span>}
        </div>
        {meal.notes && <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{meal.notes}</p>}
      </div>
      <RemoveButton onRemove={onRemove} label={`Delete ${meal.name}`} />
    </RecordShell>
  )
}
