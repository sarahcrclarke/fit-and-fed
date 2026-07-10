import { ProfileSwitcher } from '../components/ProfileSwitcher'

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-ink-50/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 md:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-moss-700 text-sm font-semibold text-moss-50">
            FF
          </span>
          <span className="font-display text-lg text-ink-900">Fit &amp; Fed</span>
        </div>
        <div className="hidden md:block">
          <p className="text-sm text-ink-400">Good to see you.</p>
        </div>
        <ProfileSwitcher />
      </div>
    </header>
  )
}
