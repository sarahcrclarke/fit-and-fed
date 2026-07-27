import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ProfileId } from '../context/ProfileContext'
import { emptyData, EMPTY_GOALS, type AppData, type Goals, type Meal, type Workout } from './types'

const STORAGE_KEY = 'fit-and-fed:data:v1'

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function readStoredData(): AppData {
  const fallback = emptyData()
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<AppData>
    return {
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
      meals: Array.isArray(parsed.meals) ? parsed.meals : [],
      goals: { ...fallback.goals, ...(parsed.goals ?? {}) },
    }
  } catch {
    // Corrupt or unreadable storage shouldn't take the app down — start fresh instead.
    return fallback
  }
}

interface DataContextValue {
  data: AppData
  addWorkout: (input: Omit<Workout, 'id'>) => void
  updateWorkout: (id: string, patch: Partial<Omit<Workout, 'id'>>) => void
  removeWorkout: (id: string) => void
  addMeal: (input: Omit<Meal, 'id'>) => void
  updateMeal: (id: string, patch: Partial<Omit<Meal, 'id'>>) => void
  removeMeal: (id: string) => void
  setGoals: (profileId: ProfileId, patch: Partial<Goals>) => void
  clearAll: () => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(readStoredData)
  const hydrated = useRef(false)

  useEffect(() => {
    // Skip the very first run so a failed read can't immediately overwrite good storage.
    if (!hydrated.current) {
      hydrated.current = true
      return
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Storage full or blocked (private mode) — the session still works in memory.
    }
  }, [data])

  const value = useMemo<DataContextValue>(() => {
    return {
      data,
      addWorkout: (input) =>
        setData((d) => ({ ...d, workouts: [...d.workouts, { ...input, id: createId() }] })),
      updateWorkout: (id, patch) =>
        setData((d) => ({
          ...d,
          workouts: d.workouts.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        })),
      removeWorkout: (id) =>
        setData((d) => ({ ...d, workouts: d.workouts.filter((w) => w.id !== id) })),
      addMeal: (input) => setData((d) => ({ ...d, meals: [...d.meals, { ...input, id: createId() }] })),
      updateMeal: (id, patch) =>
        setData((d) => ({ ...d, meals: d.meals.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
      removeMeal: (id) => setData((d) => ({ ...d, meals: d.meals.filter((m) => m.id !== id) })),
      setGoals: (profileId, patch) =>
        setData((d) => ({
          ...d,
          goals: {
            ...d.goals,
            [profileId]: { ...EMPTY_GOALS, ...d.goals[profileId], ...patch },
          },
        })),
      clearAll: () => setData(emptyData()),
    }
  }, [data])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}

/**
 * A person's view includes their own records plus anything shared with the household;
 * the household view includes everything.
 */
export function belongsToView(recordProfileId: ProfileId, activeId: ProfileId): boolean {
  if (activeId === 'household') return true
  return recordProfileId === activeId || recordProfileId === 'household'
}
