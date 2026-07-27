import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type ProfileId = 'sarah' | 'dom' | 'household'

export interface Profile {
  id: ProfileId
  name: string
  tagline: string
  initials: string
  /** Which body the muscle heatmap draws. Household has no single body, so it draws both. */
  figure?: 'female' | 'male'
}

export const PROFILES: Profile[] = [
  { id: 'sarah', name: 'Sarah', tagline: 'Personal plan', initials: 'S', figure: 'female' },
  { id: 'dom', name: 'Dom', tagline: 'Personal plan', initials: 'D', figure: 'male' },
  { id: 'household', name: 'Household', tagline: 'Shared plan', initials: 'H' },
]

const STORAGE_KEY = 'fit-and-fed:active-profile'

interface ProfileContextValue {
  activeProfile: Profile
  setActiveProfileId: (id: ProfileId) => void
  profiles: Profile[]
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

function readStoredProfileId(): ProfileId {
  if (typeof window === 'undefined') return 'household'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'sarah' || stored === 'dom' || stored === 'household') return stored
  return 'household'
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<ProfileId>(readStoredProfileId)

  const setActiveProfileId = (id: ProfileId) => {
    setActiveId(id)
    window.localStorage.setItem(STORAGE_KEY, id)
  }

  const value = useMemo<ProfileContextValue>(
    () => ({
      activeProfile: PROFILES.find((p) => p.id === activeId) ?? PROFILES[2],
      setActiveProfileId,
      profiles: PROFILES,
    }),
    [activeId],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider')
  return ctx
}
