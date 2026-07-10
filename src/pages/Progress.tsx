import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import { ProgressIcon } from '../components/icons'
import { useProfile } from '../context/ProfileContext'

export function Progress() {
  const { activeProfile } = useProfile()
  const description =
    activeProfile.id === 'household'
      ? 'Trends across training and nutrition for the household over time.'
      : `Trends across training, nutrition and body metrics for ${activeProfile.name} over time.`

  return (
    <div>
      <PageHeader eyebrow="Progress" title="Progress" description={description} />
      <EmptyState
        icon={ProgressIcon}
        title="Not enough data yet"
        body="Once workouts and meals have been logged for a little while, trends and charts will build up here."
        hint="Charts and trends will appear here"
      />
    </div>
  )
}
