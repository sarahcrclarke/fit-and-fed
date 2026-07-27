import { useEffect, useRef, useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import { formatDayRelative, todayISO } from '../data/dates'
import { useData } from '../data/store'
import { MEAL_SLOTS, type MealSlot } from '../data/types'
import { Button } from './Button'
import { Field, SegmentedControl, TextArea, TextInput } from './fields'
import { Sheet } from './Sheet'

export function MealSheet({
  open,
  onClose,
  defaultDate,
  defaultSlot = 'breakfast',
  planned = false,
}: {
  open: boolean
  onClose: () => void
  defaultDate?: string
  defaultSlot?: MealSlot
  /** `true` when the meal is being added to the weekly plan rather than logged as eaten. */
  planned?: boolean
}) {
  const { addMeal } = useData()
  const { activeProfile } = useProfile()

  const [name, setName] = useState('')
  const [slot, setSlot] = useState<MealSlot>(defaultSlot)
  const [date, setDate] = useState(defaultDate ?? todayISO())
  const [calories, setCalories] = useState('')
  const [notes, setNotes] = useState('')

  // Defaults come through a ref so inline props don't retrigger the reset — see WorkoutSheet.
  const defaultsRef = useRef({ defaultDate, defaultSlot })
  defaultsRef.current = { defaultDate, defaultSlot }
  const wasOpen = useRef(false)

  useEffect(() => {
    if (open && !wasOpen.current) {
      setName('')
      setSlot(defaultsRef.current.defaultSlot)
      setDate(defaultsRef.current.defaultDate ?? todayISO())
      setCalories('')
      setNotes('')
    }
    wasOpen.current = open
  }, [open])

  const parsedCalories = Number.parseInt(calories, 10)
  const canSave = name.trim().length > 0

  function save() {
    if (!canSave) return
    addMeal({
      profileId: activeProfile.id,
      date,
      slot,
      name: name.trim(),
      calories: Number.isFinite(parsedCalories) && parsedCalories > 0 ? parsedCalories : undefined,
      notes: notes.trim() || undefined,
      planned,
    })
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={planned ? `Plan a meal for ${formatDayRelative(date)}` : 'Log a meal'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!canSave}>
            {planned ? 'Add to plan' : 'Log meal'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Meal">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chicken traybake"
            autoFocus
          />
        </Field>

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400">
            Slot
          </span>
          <SegmentedControl options={MEAL_SLOTS} value={slot} onChange={setSlot} label="Meal slot" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Calories" hint="Optional">
            <TextInput
              type="number"
              min={1}
              inputMode="numeric"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="—"
            />
          </Field>
        </div>

        <Field label="Notes" hint="Optional — ingredients, who's cooking.">
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Uses up the peppers"
          />
        </Field>

        <p className="text-xs text-ink-400">
          Saving to <span className="font-medium text-ink-600">{activeProfile.name}</span>.
        </p>
      </div>
    </Sheet>
  )
}
