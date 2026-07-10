import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-moss-600">{eyebrow}</p>
        <h1 className="mt-1 font-display text-3xl text-ink-900 sm:text-[2.15rem]">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-500">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
