import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import { BodyFocusIcon } from '../components/icons'

export function BodyFocus() {
  return (
    <div>
      <PageHeader
        eyebrow="Training"
        title="Body Focus"
        description="Choose the muscle groups and movement patterns to prioritise this week, and see how attention is spread across the body."
      />
      <EmptyState
        icon={BodyFocusIcon}
        title="No focus areas chosen"
        body="Set your priority areas — like legs, back or core — and this space will map out how your training week covers them."
        hint="Focus areas will appear here"
      />
    </div>
  )
}
