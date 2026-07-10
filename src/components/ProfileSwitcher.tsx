import { useEffect, useRef, useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import { CheckIcon, ChevronDownIcon } from './icons'

const RING_STYLES: Record<string, string> = {
  sarah: 'bg-clay-500',
  dom: 'bg-gold-500',
  household: 'bg-moss-600',
}

export function ProfileSwitcher() {
  const { activeProfile, profiles, setActiveProfileId } = useProfile()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border border-ink-200 bg-white py-1.5 pl-1.5 pr-3 shadow-card transition hover:border-ink-300 hover:shadow-card-hover"
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${RING_STYLES[activeProfile.id]}`}
        >
          {activeProfile.initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium leading-tight text-ink-900">
            {activeProfile.name}
          </span>
          <span className="block text-xs leading-tight text-ink-400">{activeProfile.tagline}</span>
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-30 mt-2 w-60 overflow-hidden rounded-2xl border border-ink-100 bg-white p-1.5 shadow-card-hover"
        >
          <p className="px-3 pb-1.5 pt-2 text-xs font-medium uppercase tracking-wide text-ink-400">
            Switch profile
          </p>
          {profiles.map((profile) => {
            const isActive = profile.id === activeProfile.id
            return (
              <button
                key={profile.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setActiveProfileId(profile.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${
                  isActive ? 'bg-moss-50' : 'hover:bg-ink-50'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${RING_STYLES[profile.id]}`}
                >
                  {profile.initials}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium leading-tight text-ink-900">
                    {profile.name}
                  </span>
                  <span className="block text-xs leading-tight text-ink-400">{profile.tagline}</span>
                </span>
                {isActive && <CheckIcon className="h-4 w-4 text-moss-600" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
