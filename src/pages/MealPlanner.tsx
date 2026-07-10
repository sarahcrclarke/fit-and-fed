import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import { MealPlannerIcon } from '../components/icons'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function MealPlanner() {
  return (
    <div>
      <PageHeader
        eyebrow="Nutrition"
        title="Meal Planner"
        description="Plan meals across the week for the household and keep everyone's shopping list in sync."
      />

      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((day) => (
          <div
            key={day}
            className="flex min-h-28 flex-col rounded-2xl border border-dashed border-ink-200 bg-white/60 p-2.5 sm:p-3"
          >
            <span className="text-xs font-semibold text-ink-400">{day}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <EmptyState
          icon={MealPlannerIcon}
          title="This week is unplanned"
          body="Add meals to any day above to start shaping the week's menu and the household shopping list."
          hint="Weekly menu will appear here"
        />
      </div>
    </div>
  )
}
