import { useEffect, useRef, useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import { formatDayRelative, todayISO } from '../data/dates'
import type { Recipe } from '../data/recipes'
import { useData } from '../data/store'
import { MEAL_SLOTS, type MealSlot } from '../data/types'
import { Button } from './Button'
import { Field, SegmentedControl, TextArea, TextInput } from './fields'
import { MealsIcon } from './icons'
import { RecipeBrowser } from './RecipeBrowser'
import { Sheet } from './Sheet'

export function MealSheet({
  open,
  onClose,
  defaultDate,
  defaultSlot = 'breakfast',
  planned = false,
  preset,
}: {
  open: boolean
  onClose: () => void
  defaultDate?: string
  defaultSlot?: MealSlot
  /** `true` when the meal is being added to the weekly plan rather than logged as eaten. */
  planned?: boolean
  /** Prefill the form from a meal idea, e.g. when opened from the Ideas list. */
  preset?: Recipe
}) {
  const { addMeal } = useData()
  const { activeProfile } = useProfile()

  const [name, setName] = useState('')
  const [slot, setSlot] = useState<MealSlot>(defaultSlot)
  const [date, setDate] = useState(defaultDate ?? todayISO())
  const [calories, setCalories] = useState('')
  const [notes, setNotes] = useState('')
  const [browsing, setBrowsing] = useState(false)

  // Defaults come through a ref so inline props don't retrigger the reset — see WorkoutSheet.
  const defaultsRef = useRef({ defaultDate, defaultSlot, preset })
  defaultsRef.current = { defaultDate, defaultSlot, preset }
  const wasOpen = useRef(false)

  function applyRecipe(recipe: Recipe) {
    setName(recipe.name)
    setSlot(recipe.slot)
    setCalories(String(recipe.calories))
    setNotes(recipe.note ?? '')
  }

  useEffect(() => {
    if (open && !wasOpen.current) {
      const d = defaultsRef.current
      setDate(d.defaultDate ?? todayISO())
      setBrowsing(false)
      if (d.preset) {
        applyRecipe(d.preset)
      } else {
        setName('')
        setSlot(d.defaultSlot)
        setCalories('')
        setNotes('')
      }
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

  // Browsing swaps the sheet's body for the ideas list rather than stacking a second
  // overlay — picking one fills the form and comes straight back.
  if (browsing) {
    return (
      <Sheet
        open={open}
        onClose={onClose}
        title="Meal ideas"
        footer={
          <Button variant="secondary" onClick={() => setBrowsing(false)}>
            Back to form
          </Button>
        }
      >
        <RecipeBrowser
          actionLabel="Use"
          onPick={(recipe) => {
            applyRecipe(recipe)
            setBrowsing(false)
          }}
        />
      </Sheet>
    )
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
        <Button variant="secondary" size="sm" onClick={() => setBrowsing(true)} className="self-start">
          <MealsIcon className="h-3.5 w-3.5" /> Pick from meal ideas
        </Button>

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
