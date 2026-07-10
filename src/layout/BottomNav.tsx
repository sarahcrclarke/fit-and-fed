import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navigation'

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      style={{ boxShadow: 'var(--shadow-nav)' }}
    >
      <div className="mx-auto flex max-w-6xl items-stretch justify-between px-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] font-medium"
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-[21px] w-[21px] ${isActive ? 'text-moss-600' : 'text-ink-400'}`}
                />
                <span className={isActive ? 'text-moss-700' : 'text-ink-400'}>
                  {item.shortLabel ?? item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
