import { useMemo } from 'react'
import { useProfile } from '../context/ProfileContext'
import { belongsToView, useData } from './store'
import { SLOT_ORDER, type Meal, type Workout } from './types'

function byDateThenName(a: Workout, b: Workout): number {
  return a.date === b.date ? a.name.localeCompare(b.name) : a.date.localeCompare(b.date)
}

function byDateThenSlot(a: Meal, b: Meal): number {
  return a.date === b.date ? SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot] : a.date.localeCompare(b.date)
}

/** Workouts and meals narrowed to whichever profile is currently selected. */
export function useScopedData() {
  const { activeProfile } = useProfile()
  const { data } = useData()

  return useMemo(() => {
    const workouts = data.workouts
      .filter((w) => belongsToView(w.profileId, activeProfile.id))
      .sort(byDateThenName)
    const meals = data.meals
      .filter((m) => belongsToView(m.profileId, activeProfile.id))
      .sort(byDateThenSlot)
    return { workouts, meals, goals: data.goals[activeProfile.id] ?? { focusAreas: [] } }
  }, [data, activeProfile.id])
}

export function groupByDate<T extends { date: string }>(items: T[]): [string, T[]][] {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const bucket = groups.get(item.date)
    if (bucket) bucket.push(item)
    else groups.set(item.date, [item])
  }
  return [...groups.entries()]
}
