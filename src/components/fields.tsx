import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

const CONTROL =
  'w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 transition placeholder:text-ink-300 focus:border-moss-500 focus:outline-none focus:ring-2 focus:ring-moss-500/20'

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink-400">{hint}</span>}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${CONTROL} ${props.className ?? ''}`} />
}

export function Select({
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select {...rest} className={`${CONTROL} ${rest.className ?? ''}`}>
      {children}
    </select>
  )
}

export function TextArea(props: InputHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...(props as object)}
      className={`${CONTROL} resize-none ${props.className ?? ''}`}
    />
  )
}

/** Multi-select pill group — used for training focus areas. */
export function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
  label,
}: {
  options: { id: T; label: string }[]
  selected: T[]
  onToggle: (id: T) => void
  label: string
}) {
  const groupId = useId()
  return (
    <div role="group" aria-labelledby={groupId}>
      <span
        id={groupId}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400"
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isOn = selected.includes(option.id)
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isOn}
              onClick={() => onToggle(option.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                isOn
                  ? 'border-moss-600 bg-moss-600 text-white'
                  : 'border-ink-200 bg-white text-ink-500 hover:border-ink-300 hover:text-ink-800'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Single-select segmented control. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  label: string
}) {
  return (
    <div role="group" aria-label={label} className="flex gap-1 rounded-full bg-ink-100 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === value}
          onClick={() => onChange(option.id)}
          className={`flex-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
            option.id === value ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-800'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
