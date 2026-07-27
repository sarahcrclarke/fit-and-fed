import { useMemo, useState, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { MealSheet } from '../components/MealSheet'
import { PageHeader } from '../components/PageHeader'
import { SummaryCard } from '../components/SummaryCard'
import { WorkoutSheet } from '../components/WorkoutSheet'
import { MealRow, WorkoutRow } from '../components/records'
import { MealsIcon, PlusIcon, ProgressIcon, TodayIcon, WorkoutsIcon } from '../components/icons'
import { useProfile } from '../context/ProfileContext'
import { formatDayLong, formatDuration, todayISO } from '../data/dates'
import { useData } from '../data/store'
import { useScopedData } from '../data/useScoped'

export function Today() {
  const { activeProfile } = useProfile()
  const { workouts, meals } = useScopedData()
  const { updateWorkout, removeWorkout, updateMeal, removeMeal } = useData()
  const [workoutOpen, setWorkoutOpen] = useState(false)
  const [mealOpen, setMealOpen] = useState(false)

  const today = todayISO()
  const showOwner = activeProfile.id === 'household'

  const todayWorkouts = useMemo(() => workouts.filter((w) => w.date === today), [workouts, today])
  const todayMeals = useMemo(() => meals.filter((m) => m.date === today), [meals, today])

  const nextWorkout = todayWorkouts.find((w) => !w.done)
  const nextMeal = todayMeals.find((m) => m.planned)
  const minutesDone = todayWorkouts.filter((w) => w.done).reduce((sum, w) => sum + w.durationMin, 0)

  const heading =
    activeProfile.id === 'household' ? 'Today for the household' : `${activeProfile.name}'s today`

  const hasAnything = todayWorkouts.length > 0 || todayMeals.length > 0

  return (
    <div>
      <PageHeader
        eyebrow={formatDayLong(today)}
        title={heading}
        description="A single view of what's planned for today — workouts, meals and how things are tracking."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setMealOpen(true)}>
              <PlusIcon className="h-3.5 w-3.5" /> Meal
            </Button>
            <Button size="sm" onClick={() => setWorkoutOpen(true)}>
              <PlusIcon className="h-3.5 w-3.5" /> Workout
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={WorkoutsIcon}
          label="Next workout"
          value={nextWorkout?.name ?? (todayWorkouts.length > 0 ? 'All done' : 'Nothing planned')}
          tone="moss"
        />
        <SummaryCard
          icon={MealsIcon}
          label="Next meal"
          value={nextMeal?.name ?? (todayMeals.length > 0 ? 'All eaten' : 'Nothing logged')}
          tone="clay"
        />
        <SummaryCard
          icon={ProgressIcon}
          label="Training today"
          value={minutesDone > 0 ? formatDuration(minutesDone) : 'Not started'}
        />
      </div>

      {hasAnything ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section>
            <SectionTitle>Workouts</SectionTitle>
            {todayWorkouts.length === 0 ? (
              <QuietNote>Nothing planned for today.</QuietNote>
            ) : (
              <div className="flex flex-col gap-2.5">
                {todayWorkouts.map((workout) => (
                  <WorkoutRow
                    key={workout.id}
                    workout={workout}
                    showOwner={showOwner}
                    onToggleDone={() => updateWorkout(workout.id, { done: !workout.done })}
                    onRemove={() => removeWorkout(workout.id)}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionTitle>Meals</SectionTitle>
            {todayMeals.length === 0 ? (
              <QuietNote>Nothing logged yet today.</QuietNote>
            ) : (
              <div className="flex flex-col gap-2.5">
                {todayMeals.map((meal) => (
                  <MealRow
                    key={meal.id}
                    meal={meal}
                    showOwner={showOwner}
                    onToggleEaten={() => updateMeal(meal.id, { planned: !meal.planned })}
                    onRemove={() => removeMeal(meal.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={TodayIcon}
            title="Nothing on the plan yet"
            body="Add a workout or log a meal and it will show up here, in order, through the day."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={() => setWorkoutOpen(true)}>
                  <PlusIcon className="h-4 w-4" /> Add a workout
                </Button>
                <Button variant="secondary" onClick={() => setMealOpen(true)}>
                  <PlusIcon className="h-4 w-4" /> Log a meal
                </Button>
              </div>
            }
          />
        </div>
      )}

      <WorkoutSheet open={workoutOpen} onClose={() => setWorkoutOpen(false)} defaultDate={today} />
      <MealSheet open={mealOpen} onClose={() => setMealOpen(false)} defaultDate={today} />
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2.5 px-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
      {children}
    </h2>
  )
}

function QuietNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-ink-200 bg-white/50 px-4 py-6 text-center text-sm text-ink-400">
      {children}
    </p>
  )
}
