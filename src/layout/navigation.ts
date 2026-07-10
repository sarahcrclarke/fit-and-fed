import type { ComponentType } from 'react'
import type { SVGProps } from 'react'
import {
  BodyFocusIcon,
  MealPlannerIcon,
  MealsIcon,
  ProfileIcon,
  ProgressIcon,
  TodayIcon,
  WorkoutsIcon,
} from '../components/icons'

export interface NavItem {
  to: string
  label: string
  shortLabel?: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Today', icon: TodayIcon },
  { to: '/workouts', label: 'Workouts', icon: WorkoutsIcon },
  { to: '/body-focus', label: 'Body Focus', shortLabel: 'Body', icon: BodyFocusIcon },
  { to: '/meals', label: 'Meals', icon: MealsIcon },
  { to: '/meal-planner', label: 'Meal Planner', shortLabel: 'Planner', icon: MealPlannerIcon },
  { to: '/progress', label: 'Progress', icon: ProgressIcon },
  { to: '/profile', label: 'Profile & Settings', shortLabel: 'Profile', icon: ProfileIcon },
]
