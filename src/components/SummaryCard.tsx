import type { ComponentType, SVGProps } from 'react'

export function SummaryCard({
  icon: Icon,
  label,
  value,
  tone = 'neutral',
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  value: string
  tone?: 'neutral' | 'moss' | 'clay'
}) {
  const toneStyles: Record<string, string> = {
    neutral: 'bg-ink-100 text-ink-500',
    moss: 'bg-moss-100 text-moss-700',
    clay: 'bg-clay-100 text-clay-600',
  }

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-ink-100 bg-white px-4 py-4 shadow-card transition hover:shadow-card-hover">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneStyles[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink-400">{label}</p>
        <p className="truncate text-sm font-medium text-ink-800">{value}</p>
      </div>
    </div>
  )
}
