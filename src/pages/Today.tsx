import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import { SummaryCard } from '../components/SummaryCard'
import { useProfile } from '../context/ProfileContext'
import { MealsIcon, ProgressIcon, TodayIcon, WorkoutsIcon } from '../components/icons'

const todayLabel = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

export function Today() {
  const { activeProfile } = useProfile()
  const heading =
    activeProfile.id === 'household' ? "Today for the household" : `${activeProfile.name}'s today`

  return (
    <div>
      <PageHeader eyebrow={todayLabel} title={heading} description="A single view of what's planned for today — workouts, meals and how things are tracking." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard icon={WorkoutsIcon} label="Next workout" value="Nothing planned" tone="moss" />
        <SummaryCard icon={MealsIcon} label="Next meal" value="Nothing logged" tone="clay" />
        <SummaryCard icon={ProgressIcon} label="Check-in" value="Not started" />
      </div>

      <div className="mt-6">
        <EmptyState
          icon={TodayIcon}
          title="Today is a blank page"
          body="Once workouts and meals are added to the plan, they'll show up here in order through the day."
          hint="Plans you add will appear here"
        />
      </div>
    </div>
  )
}
