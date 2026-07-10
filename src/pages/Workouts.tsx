import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import { WorkoutsIcon } from '../components/icons'
import { useProfile } from '../context/ProfileContext'

export function Workouts() {
  const { activeProfile } = useProfile()
  const description =
    activeProfile.id === 'household'
      ? 'Strength, cardio and mobility sessions for the household, all in one place.'
      : `Strength, cardio and mobility sessions for ${activeProfile.name}.`

  return (
    <div>
      <PageHeader eyebrow="Training" title="Workouts" description={description} />
      <EmptyState
        icon={WorkoutsIcon}
        title="No workouts yet"
        body="Sessions you plan or log will be listed here, organised by day, so you can see training history at a glance."
        hint="Session history will appear here"
      />
    </div>
  )
}
