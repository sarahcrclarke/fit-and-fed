import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function TodayIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
      <path d="M8 3v3M16 3v3M3.5 9.5h17" />
      <path d="M8 13.2h2M8 16.6h5" />
    </svg>
  )
}

export function WorkoutsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 8.5v7M17.5 8.5v7" />
      <path d="M3.5 10.5v3M20.5 10.5v3" />
      <path d="M6.5 12h11" strokeWidth="2.25" />
    </svg>
  )
}

export function BodyFocusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function MealsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3v7a2.5 2.5 0 0 0 5 0V3" />
      <path d="M8.5 10v11" />
      <path d="M17 3c-1.5 0-2.5 1.8-2.5 4.5S15.5 12 17 12s2.5-1.8 2.5-4.5S18.5 3 17 3Z" />
      <path d="M17 12v9" />
    </svg>
  )
}

export function MealPlannerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v3M16 3v3" />
      <path d="M7.5 13h2v2h-2zM11 13h2v2h-2zM14.5 13h2v2h-2zM7.5 16.5h2v2h-2zM11 16.5h2v2h-2z" />
    </svg>
  )
}

export function ProgressIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V13M9.5 20V8M15 20v-6.5M20 20V5" />
    </svg>
  )
}

export function ProfileIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8.2" r="3.5" />
      <path d="M4.8 19.5a7.2 7.2 0 0 1 14.4 0" />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2.25} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  )
}
