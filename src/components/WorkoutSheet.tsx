import { useEffect, useRef, useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import { todayISO } from '../data/dates'
import { useData } from '../data/store'
import { BODY_AREAS, WORKOUT_TYPES, type BodyArea, type WorkoutType } from '../data/types'
import { Button } from './Button'
import { ChipGroup, Field, SegmentedControl, TextArea, TextInput } from './fields'
import { Sheet } from './Sheet'

export function WorkoutSheet({
  open,
  onClose,
  defaultDate,
  defaultAreas = [],
}: {
  open: boolean
  onClose: () => void
  defaultDate?: string
  defaultAreas?: BodyArea[]
}) {
  const { addWorkout } = useData()
  const { activeProfile } = useProfile()

  const [name, setName] = useState('')
  const [type, setType] = useState<WorkoutType>('strength')
  const [date, setDate] = useState(defaultDate ?? todayISO())
  const [duration, setDuration] = useState('45')
  const [areas, setAreas] = useState<BodyArea[]>(defaultAreas)
  const [notes, setNotes] = useState('')

  // Reset to a clean form on each open. Defaults go through a ref so that callers passing
  // inline values (`defaultAreas={[]}`) don't re-trigger the reset on every render.
  const defaultsRef = useRef({ defaultDate, defaultAreas })
  defaultsRef.current = { defaultDate, defaultAreas }
  const wasOpen = useRef(false)

  useEffect(() => {
    if (open && !wasOpen.current) {
      setName('')
      setType('strength')
      setDate(defaultsRef.current.defaultDate ?? todayISO())
      setDuration('45')
      setAreas(defaultsRef.current.defaultAreas)
      setNotes('')
    }
    wasOpen.current = open
  }, [open])

  const durationMin = Number.parseInt(duration, 10)
  const canSave = name.trim().length > 0 && Number.isFinite(durationMin) && durationMin > 0

  function save() {
    if (!canSave) return
    addWorkout({
      profileId: activeProfile.id,
      date,
      name: name.trim(),
      type,
      durationMin,
      areas,
      notes: notes.trim() || undefined,
      done: false,
    })
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Add a workout"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!canSave}>
            Save workout
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Session">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Upper body strength"
            autoFocus
          />
        </Field>

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400">
            Type
          </span>
          <SegmentedControl options={WORKOUT_TYPES} value={type} onChange={setType} label="Workout type" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Minutes">
            <TextInput
              type="number"
              min={1}
              inputMode="numeric"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Field>
        </div>

        <ChipGroup
          label="Focus areas"
          options={BODY_AREAS}
          selected={areas}
          onToggle={(id) =>
            setAreas((current) =>
              current.includes(id) ? current.filter((a) => a !== id) : [...current, id],
            )
          }
        />

        <Field label="Notes" hint="Optional — sets, weights, how it felt.">
          <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="3 × 8 at 40kg" />
        </Field>

        <p className="text-xs text-ink-400">
          Saving to <span className="font-medium text-ink-600">{activeProfile.name}</span>.
        </p>
      </div>
    </Sheet>
  )
}
