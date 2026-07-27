import type { ProfileId } from '../context/ProfileContext'

export type WorkoutType = 'strength' | 'cardio' | 'mobility'

export const WORKOUT_TYPES: { id: WorkoutType; label: string }[] = [
  { id: 'strength', label: 'Strength' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'mobility', label: 'Mobility' },
]

export type BodyArea =
  | 'legs'
  | 'glutes'
  | 'back'
  | 'chest'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'conditioning'

export const BODY_AREAS: { id: BodyArea; label: string }[] = [
  { id: 'legs', label: 'Legs' },
  { id: 'glutes', label: 'Glutes' },
  { id: 'back', label: 'Back' },
  { id: 'chest', label: 'Chest' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'core', label: 'Core' },
  { id: 'conditioning', label: 'Conditioning' },
]

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export const MEAL_SLOTS: { id: MealSlot; label: string }[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
]

export const SLOT_ORDER: Record<MealSlot, number> = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
  snack: 3,
}

export interface Workout {
  id: string
  profileId: ProfileId
  /** Local calendar day, `yyyy-mm-dd`. */
  date: string
  name: string
  type: WorkoutType
  durationMin: number
  areas: BodyArea[]
  notes?: string
  done: boolean
}

export interface Meal {
  id: string
  profileId: ProfileId
  /** Local calendar day, `yyyy-mm-dd`. */
  date: string
  slot: MealSlot
  name: string
  calories?: number
  notes?: string
  /** `true` while the meal is only planned; flipped when it is actually eaten. */
  planned: boolean
}

export interface Goals {
  workoutsPerWeek?: number
  focusAreas: BodyArea[]
}

export interface AppData {
  workouts: Workout[]
  meals: Meal[]
  goals: Record<ProfileId, Goals>
}

export const EMPTY_GOALS: Goals = { focusAreas: [] }

export function emptyData(): AppData {
  return {
    workouts: [],
    meals: [],
    goals: {
      sarah: { ...EMPTY_GOALS, focusAreas: [] },
      dom: { ...EMPTY_GOALS, focusAreas: [] },
      household: { ...EMPTY_GOALS, focusAreas: [] },
    },
  }
}
