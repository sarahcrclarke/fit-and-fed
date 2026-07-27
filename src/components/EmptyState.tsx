import type { ComponentType, ReactNode, SVGProps } from 'react'

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white/60 px-6 py-14 text-center shadow-card">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-moss-100 text-moss-700">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-5 font-display text-xl text-ink-900">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
