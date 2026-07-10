import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import { MealsIcon } from '../components/icons'
import { useProfile } from '../context/ProfileContext'

export function Meals() {
  const { activeProfile } = useProfile()
  const description =
    activeProfile.id === 'household'
      ? 'Breakfast, lunch, dinner and snacks logged across the household.'
      : `Breakfast, lunch, dinner and snacks logged for ${activeProfile.name}.`

  return (
    <div>
      <PageHeader eyebrow="Nutrition" title="Meals" description={description} />
      <EmptyState
        icon={MealsIcon}
        title="No meals logged today"
        body="Log a meal to start building a food history — everything you add will be listed here by day."
        hint="Logged meals will appear here"
      />
    </div>
  )
}
