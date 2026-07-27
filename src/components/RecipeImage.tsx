import { useId, type ReactNode } from 'react'
import type { DishArt, Recipe, RecipeCategory } from '../data/recipes'
import { recipePhoto } from '../data/recipePhotos'

/**
 * Pictures of the meal ideas.
 *
 * A recipe shows a photograph when one exists for it in `src/assets/recipes/` — see
 * `recipePhotos.ts` for the naming convention. The drawings below are the fallback for
 * recipes that don't have a photo yet, so the list is never blank.
 *
 * Each drawing lives on a 64 × 64 canvas. Crockery comes from the shared pieces at the
 * top; the food on it is what makes each dish recognisable.
 */

const C = {
  plate: '#ffffff',
  plateEdge: '#dde1e3',
  bowl: '#f2f4f4',
  bowlEdge: '#ccd3d4',
  tray: '#e3e6e7',
  trayEdge: '#c3c9cb',
  chicken: '#e2b878',
  chickenDark: '#c9994f',
  crumb: '#d99a41',
  crumbDark: '#bf7d2c',
  beef: '#a4553a',
  beefDark: '#83422c',
  lamb: '#b05a45',
  salmon: '#e08a63',
  fish: '#eddcc0',
  tomato: '#c4472e',
  tomatoLight: '#d9603f',
  cream: '#f2e6cf',
  pasta: '#ecd08f',
  cheese: '#e8b943',
  potato: '#dfae63',
  potatoDark: '#c4903f',
  chip: '#e8c887',
  green: '#4f8b52',
  greenLight: '#7aad63',
  leaf: '#8fbf74',
  lemon: '#e6c243',
  melon: '#d94f5c',
  rind: '#4f8b52',
  bread: '#e5c48c',
} as const

// Tint behind the dish, so a category is recognisable before the label is read.
const CATEGORY_TINT: Record<RecipeCategory, string> = {
  chicken: '#f8ecd1',
  beef: '#fbe9dd',
  lamb: '#fdf4ee',
  fish: '#e8f0f2',
  pasta: '#f8ecd1',
  sides: '#eef0f1',
  kids: '#e2f1e6',
}

/* -------------------------------------------------------------- shared crockery */

function Plate() {
  return (
    <>
      <ellipse cx="32" cy="42" rx="26" ry="12" fill={C.plate} stroke={C.plateEdge} strokeWidth="1.2" />
      <ellipse cx="32" cy="41" rx="19" ry="8" fill="none" stroke={C.plateEdge} strokeWidth="0.8" />
    </>
  )
}

function Bowl() {
  return (
    <>
      <path
        d="M8 32h48c0 12-10 21-24 21S8 44 8 32Z"
        fill={C.bowl}
        stroke={C.bowlEdge}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <ellipse cx="32" cy="32" rx="24" ry="6" fill={C.bowl} stroke={C.bowlEdge} strokeWidth="1.2" />
    </>
  )
}

/** The contents of a bowl, clipped so nothing spills over the rim. */
function BowlFill({ children }: { children: ReactNode }) {
  const id = useId()
  return (
    <>
      <defs>
        <clipPath id={id}>
          <path d="M8 30h48c0 13-10 22-24 22S8 43 8 30Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </>
  )
}

function Tray() {
  return (
    <rect
      x="6"
      y="24"
      width="52"
      height="28"
      rx="5"
      fill={C.tray}
      stroke={C.trayEdge}
      strokeWidth="1.2"
    />
  )
}

/* ------------------------------------------------------------------ the dishes */

function ChickenCream() {
  return (
    <>
      <Plate />
      <ellipse cx="32" cy="39" rx="17" ry="7" fill={C.cream} />
      <path d="M22 38c2-6 8-9 13-7s6 8 2 11-13 1-15-4Z" fill={C.chicken} stroke={C.chickenDark} strokeWidth="1" />
      <circle cx="21" cy="42" r="2.4" fill={C.tomato} />
      <circle cx="43" cy="41" r="2.2" fill={C.tomato} />
      <path d="M38 44c3-3 6-3 8-1-2 3-6 3-8 1Z" fill={C.green} />
      <path d="M20 36c3-2 6-2 8 0-2 2-6 2-8 0Z" fill={C.green} />
    </>
  )
}

function ChickenCouscous() {
  return (
    <>
      <Plate />
      <path d="M18 42c0-5 5-8 10-8s10 3 10 8Z" fill={C.pasta} />
      <path d="M30 36c3-5 9-6 12-3s2 9-3 10-9-3-9-7Z" fill={C.chicken} stroke={C.chickenDark} strokeWidth="1" />
      <path d="M44 40a5 5 0 0 1 8 3 5 5 0 0 1-8-3Z" fill={C.lemon} />
      <path d="M16 44c3-2 6-2 8 0-2 2-6 2-8 0Z" fill={C.green} />
    </>
  )
}

function Wrap({ filling = C.chicken }: { filling?: string }) {
  // Two rolled halves stood on end, cut faces up, so the filling reads at a glance.
  return (
    <>
      <g transform="rotate(-5 30 40)">
        <rect x="21" y="24" width="18" height="30" rx="3.5" fill={C.bread} stroke="#cfa96a" strokeWidth="1.1" />
        <path d="M24 34h12M24 42h12" stroke="#cfa96a" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <ellipse cx="30" cy="24" rx="9" ry="3.8" fill="#eed4a4" stroke="#cfa96a" strokeWidth="1.1" />
        <ellipse cx="30" cy="24" rx="5.8" ry="2.3" fill={filling} />
        <path d="M25 25c3-1.8 7-1.8 10 0-3 1.6-7 1.6-10 0Z" fill={C.leaf} />
      </g>
      <g transform="rotate(7 49 44)">
        <rect x="41" y="32" width="15" height="22" rx="3" fill={C.bread} stroke="#cfa96a" strokeWidth="1.1" />
        <path d="M44 42h9" stroke="#cfa96a" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <ellipse cx="48.5" cy="32" rx="7.5" ry="3.2" fill="#eed4a4" stroke="#cfa96a" strokeWidth="1" />
        <ellipse cx="48.5" cy="32" rx="4.6" ry="1.9" fill={filling} />
      </g>
    </>
  )
}

function Kiev() {
  return (
    <>
      <Plate />
      <path d="M16 38c1-6 7-10 16-10s16 4 17 10c1 5-7 8-17 8s-17-3-16-8Z" fill={C.crumb} stroke={C.crumbDark} strokeWidth="1.1" />
      <path d="M27 36c2-3 8-3 10 0s-1 6-5 6-7-3-5-6Z" fill="#dbe8a8" />
      <path d="M22 32h3M30 30h4M40 33h3M25 41h4M36 41h4" stroke={C.crumbDark} strokeWidth="1.1" strokeLinecap="round" />
    </>
  )
}

function CrispyChicken() {
  return (
    <>
      <Plate />
      {/* Two drumsticks and a thigh — the bones are what say "chicken" at this size. */}
      <g fill="#f4efe3" stroke="#d6cdba" strokeWidth="0.9">
        <rect x="16" y="40" width="5" height="10" rx="2.5" transform="rotate(28 18.5 45)" />
        <rect x="43" y="40" width="5" height="10" rx="2.5" transform="rotate(-28 45.5 45)" />
      </g>
      <g fill={C.crumb} stroke={C.crumbDark} strokeWidth="1">
        <ellipse cx="22" cy="36" rx="9" ry="7.5" transform="rotate(-22 22 36)" />
        <ellipse cx="42" cy="36" rx="9" ry="7.5" transform="rotate(22 42 36)" />
        <ellipse cx="32" cy="44" rx="8" ry="6" />
      </g>
      <g stroke={C.crumbDark} strokeWidth="1.1" strokeLinecap="round" opacity="0.8">
        <path d="M18 33h4M40 33h4M29 43h6" />
      </g>
    </>
  )
}

function Tenders() {
  return (
    <>
      <Plate />
      <g fill={C.crumb} stroke={C.crumbDark} strokeWidth="1">
        <rect x="12" y="32" width="9" height="17" rx="4.5" transform="rotate(-14 16.5 40.5)" />
        <rect x="22" y="30" width="9" height="19" rx="4.5" transform="rotate(-4 26.5 39.5)" />
        <rect x="32" y="31" width="9" height="18" rx="4.5" transform="rotate(6 36.5 40)" />
      </g>
      <ellipse cx="50" cy="42" rx="8" ry="6" fill={C.bowl} stroke={C.bowlEdge} strokeWidth="1" />
      <ellipse cx="50" cy="41" rx="5.5" ry="3.6" fill={C.tomatoLight} />
    </>
  )
}

function Traybake() {
  return (
    <>
      <Tray />
      <circle cx="18" cy="34" r="5" fill={C.chicken} stroke={C.chickenDark} strokeWidth="0.9" />
      <circle cx="33" cy="32" r="5.5" fill={C.chicken} stroke={C.chickenDark} strokeWidth="0.9" />
      <circle cx="47" cy="35" r="4.5" fill={C.chicken} stroke={C.chickenDark} strokeWidth="0.9" />
      <rect x="12" y="41" width="9" height="6" rx="2.5" fill={C.potato} />
      <rect x="24" y="42" width="9" height="6" rx="2.5" fill={C.tomato} />
      <rect x="36" y="41" width="8" height="6" rx="2.5" fill={C.green} />
      <rect x="46" y="42" width="8" height="6" rx="2.5" fill={C.potato} />
    </>
  )
}

function MealPrepBox() {
  return (
    <>
      <rect x="7" y="22" width="50" height="30" rx="5" fill="#eef2f2" stroke={C.bowlEdge} strokeWidth="1.2" />
      {/* Rice, chicken and broccoli in three compartments. */}
      <rect x="10" y="25" width="17" height="24" rx="3" fill="#f6efdc" />
      <g fill="#e2d3ab">
        <ellipse cx="14" cy="31" rx="2.4" ry="1.5" transform="rotate(-20 14 31)" />
        <ellipse cx="20" cy="29" rx="2.4" ry="1.5" transform="rotate(15 20 29)" />
        <ellipse cx="23" cy="35" rx="2.4" ry="1.5" transform="rotate(-10 23 35)" />
        <ellipse cx="15" cy="38" rx="2.4" ry="1.5" transform="rotate(25 15 38)" />
        <ellipse cx="20" cy="43" rx="2.4" ry="1.5" transform="rotate(-15 20 43)" />
        <ellipse cx="13" cy="45" rx="2.4" ry="1.5" transform="rotate(10 13 45)" />
      </g>
      <g fill={C.chicken} stroke={C.chickenDark} strokeWidth="0.9">
        <rect x="29" y="26" width="13" height="7" rx="3" />
        <rect x="29" y="35" width="13" height="7" rx="3" />
        <rect x="29" y="44" width="13" height="5.5" rx="2.7" />
      </g>
      <g fill={C.green}>
        <circle cx="49" cy="29" r="5" />
        <rect x="47.6" y="33" width="2.8" height="5" rx="1.4" fill={C.greenLight} />
        <circle cx="49" cy="43" r="5" />
        <rect x="47.6" y="47" width="2.8" height="4" rx="1.4" fill={C.greenLight} />
      </g>
    </>
  )
}

function PastaBowl({ sauce }: { sauce: string }) {
  return (
    <>
      <Bowl />
      <BowlFill>
        <ellipse cx="32" cy="34" rx="23" ry="7" fill={C.pasta} />
        <path d="M9 34h46v20H9Z" fill={C.pasta} />
        {/* Strands cut into the nest, then the sauce sits on top of it. */}
        <g stroke="#d6ad63" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M11 34c5-5 12-7 19-5" />
          <path d="M13 41c6-6 14-8 22-5" />
          <path d="M28 31c7-1 14 1 18 5" />
          <path d="M32 46c5-4 11-5 16-2" />
          <path d="M16 47c4-4 9-6 14-6" />
        </g>
        <ellipse cx="32" cy="39" rx="13.5" ry="6.5" fill={sauce} />
      </BowlFill>
      <circle cx="26" cy="38" r="1.8" fill={C.green} />
      <circle cx="39" cy="41" r="1.8" fill={C.green} />
    </>
  )
}

function Bolognese() {
  return (
    <>
      <Bowl />
      <BowlFill>
        <ellipse cx="32" cy="34" rx="23" ry="7" fill={C.pasta} />
        <path d="M9 34h46v20H9Z" fill={C.pasta} />
        <g stroke="#f0d79b" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M11 34c5-4 12-6 19-4" />
          <path d="M34 31c7 0 13 2 17 6" />
        </g>
        <path d="M14 36c4-4 34-4 36 0 2 7-6 12-18 12s-20-6-18-12Z" fill={C.tomato} />
        <circle cx="24" cy="39" r="2.4" fill={C.beefDark} />
        <circle cx="33" cy="42" r="2.4" fill={C.beefDark} />
        <circle cx="41" cy="38" r="2.2" fill={C.beefDark} />
      </BowlFill>
      <path d="M29 32c2-2 5-2 6 0-2 2-4 2-6 0Z" fill={C.leaf} />
    </>
  )
}

function Chilli() {
  return (
    <>
      <Bowl />
      <BowlFill>
        <ellipse cx="32" cy="34" rx="23" ry="7" fill={C.tomato} />
        <path d="M9 34c0 12 10 19 23 19s23-7 23-19Z" fill={C.tomato} />
        <ellipse cx="22" cy="36" rx="3" ry="2.2" fill={C.beefDark} />
        <ellipse cx="33" cy="39" rx="3" ry="2.2" fill="#8d5a34" />
        <ellipse cx="42" cy="35" rx="2.8" ry="2" fill={C.beefDark} />
        <ellipse cx="27" cy="43" rx="2.6" ry="2" fill="#8d5a34" />
      </BowlFill>
      <ellipse cx="36" cy="33" rx="6" ry="3" fill="#f6f2ea" />
      <path d="M28 31c2-2 5-2 7 0-2 2-5 2-7 0Z" fill={C.leaf} />
    </>
  )
}

function BurritoBowl() {
  return (
    <>
      <Bowl />
      <BowlFill>
        <ellipse cx="32" cy="34" rx="23" ry="7" fill={C.pasta} />
        <path d="M9 34h23v20H9Z" fill={C.beef} />
        <path d="M32 34h23v10H32Z" fill={C.green} />
        <path d="M32 44h23v10H32Z" fill={C.tomatoLight} />
      </BowlFill>
      <ellipse cx="32" cy="34" rx="23" ry="6" fill="none" stroke={C.bowlEdge} strokeWidth="1.2" />
      <ellipse cx="32" cy="37" rx="5" ry="3" fill="#f6f2ea" />
    </>
  )
}

function CheeseburgerBowl() {
  return (
    <>
      <Bowl />
      <BowlFill>
        <ellipse cx="32" cy="34" rx="23" ry="7" fill={C.leaf} />
        <path d="M9 36h46v18H9Z" fill={C.leaf} />
        <ellipse cx="24" cy="39" rx="8" ry="5" fill={C.beef} />
        <ellipse cx="24" cy="37" rx="7" ry="3.4" fill={C.cheese} />
        <ellipse cx="42" cy="42" rx="7" ry="4.5" fill={C.beef} />
      </BowlFill>
      <circle cx="45" cy="34" r="3" fill={C.tomato} />
    </>
  )
}

function Meatballs() {
  return (
    <>
      <Bowl />
      <BowlFill>
        <ellipse cx="32" cy="34" rx="23" ry="7" fill={C.tomato} />
        <path d="M9 34h46v20H9Z" fill={C.tomato} />
        <circle cx="21" cy="37" r="5.5" fill={C.beef} stroke={C.beefDark} strokeWidth="0.9" />
        <circle cx="33" cy="41" r="5.5" fill={C.beef} stroke={C.beefDark} strokeWidth="0.9" />
        <circle cx="43" cy="36" r="5" fill={C.beef} stroke={C.beefDark} strokeWidth="0.9" />
      </BowlFill>
      <path d="M28 32c2-2 5-2 6 0-2 2-4 2-6 0Z" fill={C.leaf} />
    </>
  )
}

function CottagePie() {
  return (
    <>
      <rect x="7" y="25" width="50" height="26" rx="8" fill={C.tray} stroke={C.trayEdge} strokeWidth="1.2" />
      <rect x="11" y="29" width="42" height="18" rx="6" fill={C.potato} />
      <path
        d="M14 34c3-3 6 1 9-2s6 3 9 0 6 3 9 0 5 2 8 0"
        stroke={C.potatoDark}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 41c3-3 6 1 9-2s6 3 9 0 6 3 9 0 5 2 8 0"
        stroke={C.potatoDark}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </>
  )
}

function Lasagne() {
  return (
    <>
      <Plate />
      <path d="M14 40 22 22h22l8 18Z" fill={C.pasta} stroke="#d9b96e" strokeWidth="1" strokeLinejoin="round" />
      <path d="M17.5 32h29l1.5 3.4H16Z" fill={C.tomato} />
      <path d="M20 26h20l1.4 3.2H18.6Z" fill={C.tomato} />
      <path d="M18.8 35.6h26.4l1 2.4H17.8Z" fill={C.cream} />
      <ellipse cx="33" cy="22" rx="11" ry="2.6" fill={C.cheese} />
    </>
  )
}

function MacCheese() {
  return (
    <>
      <rect x="7" y="25" width="50" height="26" rx="8" fill={C.tray} stroke={C.trayEdge} strokeWidth="1.2" />
      <rect x="11" y="29" width="42" height="18" rx="6" fill={C.cheese} />
      <g fill="#f3d688">
        <circle cx="18" cy="34" r="2.6" />
        <circle cx="26" cy="38" r="2.6" />
        <circle cx="34" cy="33" r="2.6" />
        <circle cx="42" cy="38" r="2.6" />
        <circle cx="48" cy="34" r="2.4" />
        <circle cx="22" cy="43" r="2.4" />
        <circle cx="38" cy="43" r="2.4" />
      </g>
    </>
  )
}

function GnocchiBake() {
  return (
    <>
      <rect x="7" y="25" width="50" height="26" rx="8" fill={C.tray} stroke={C.trayEdge} strokeWidth="1.2" />
      <rect x="11" y="29" width="42" height="18" rx="6" fill={C.tomato} />
      <g fill={C.pasta}>
        <ellipse cx="19" cy="35" rx="4" ry="3" />
        <ellipse cx="30" cy="33" rx="4" ry="3" />
        <ellipse cx="41" cy="35" rx="4" ry="3" />
        <ellipse cx="24" cy="42" rx="4" ry="3" />
        <ellipse cx="36" cy="42" rx="4" ry="3" />
        <ellipse cx="47" cy="41" rx="3.6" ry="2.8" />
      </g>
      <path d="M14 31c2-2 4-2 5 0-2 2-4 2-5 0Z" fill={C.leaf} />
    </>
  )
}

function LambRack() {
  return (
    <>
      <Plate />
      <g stroke="#efe7d6" strokeWidth="2.6" strokeLinecap="round">
        <path d="M20 32 17 22M28 30l-2-10M36 30l1-10M44 32l3-10" />
      </g>
      <path d="M14 38c0-6 8-9 18-9s18 3 18 9-8 9-18 9-18-3-18-9Z" fill={C.lamb} stroke="#8d4635" strokeWidth="1.1" />
      <path d="M19 38c0-3 6-5 13-5s13 2 13 5-6 5-13 5-13-2-13-5Z" fill="#c97a63" />
      <path d="M43 44c3-3 6-3 8-1-2 3-6 3-8 1Z" fill={C.green} />
    </>
  )
}

function LambPotatoes() {
  return (
    <>
      <Plate />
      <path d="M13 38c0-4 5-7 11-7s11 3 11 7-5 7-11 7-11-3-11-7Z" fill={C.lamb} stroke="#8d4635" strokeWidth="1.1" />
      <path d="M17 37h14M17 40h14" stroke="#8d4635" strokeWidth="1" strokeLinecap="round" />
      <circle cx="41" cy="38" r="5" fill={C.potato} stroke={C.potatoDark} strokeWidth="0.9" />
      <circle cx="50" cy="42" r="4.4" fill={C.potato} stroke={C.potatoDark} strokeWidth="0.9" />
      <path d="M38 30c4 1 7 3 8 6-4 0-7-2-8-6Z" fill={C.green} />
    </>
  )
}

function Flatbread() {
  return (
    <>
      <path d="M10 44c0-11 10-19 22-19s22 8 22 19Z" fill={C.bread} stroke="#cfa96a" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M15 40c0-8 8-13 17-13s17 5 17 13Z" fill="#eed4a4" />
      <ellipse cx="24" cy="35" rx="5" ry="3.4" fill={C.lamb} />
      <ellipse cx="38" cy="34" rx="5" ry="3.4" fill={C.lamb} />
      <path d="M18 40h28" stroke={C.leaf} strokeWidth="2.6" strokeLinecap="round" />
      <ellipse cx="32" cy="30" rx="4" ry="2.4" fill="#f6f2ea" />
      <path d="M10 44h44" stroke="#cfa96a" strokeWidth="1.2" strokeLinecap="round" />
    </>
  )
}

function FishAndChips() {
  return (
    <>
      <Plate />
      {/* Crumbed fish is deliberately darker and fatter than the chips beside it. */}
      <g fill={C.crumb} stroke={C.crumbDark} strokeWidth="1">
        <rect x="9" y="31" width="9" height="17" rx="3.5" transform="rotate(-10 13.5 39.5)" />
        <rect x="19" y="30" width="9" height="18" rx="3.5" transform="rotate(-2 23.5 39)" />
      </g>
      <g fill={C.crumbDark} opacity="0.55">
        <circle cx="13" cy="36" r="0.9" />
        <circle cx="15" cy="42" r="0.9" />
        <circle cx="23" cy="35" r="0.9" />
        <circle cx="24" cy="42" r="0.9" />
      </g>
      <g fill={C.chip} stroke="#cfa04a" strokeWidth="0.9">
        <rect x="33" y="30" width="4" height="17" rx="2" transform="rotate(-12 35 38.5)" />
        <rect x="39" y="31" width="4" height="16" rx="2" transform="rotate(-2 41 39)" />
        <rect x="45" y="31" width="4" height="16" rx="2" transform="rotate(8 47 39)" />
        <rect x="51" y="33" width="4" height="14" rx="2" transform="rotate(16 53 40)" />
      </g>
    </>
  )
}

function SalmonTraybake() {
  return (
    <>
      <Tray />
      <path d="M12 36c0-4 7-7 15-7s14 3 14 7-6 7-14 7-15-3-15-7Z" fill={C.salmon} stroke="#c06d4a" strokeWidth="1.1" />
      <path
        d="M15 34c4-2 8-2 12 0M15 38c4-2 8-2 12 0M29 35c3-1 6-1 9 0"
        stroke="#f3b697"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M45 30v16M43 33l4 2M43 38l4 2M47 33l-4 2" stroke={C.green} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M52 31v15M50 34l4 2M50 40l4 2" stroke={C.green} strokeWidth="1.6" strokeLinecap="round" />
    </>
  )
}

function RoastPotatoes() {
  return (
    <>
      <Bowl />
      <BowlFill>
        <ellipse cx="32" cy="34" rx="23" ry="7" fill={C.potato} />
        <path d="M9 34h46v20H9Z" fill={C.potato} />
        <g fill={C.potatoDark} opacity="0.55">
          <ellipse cx="20" cy="36" rx="5.5" ry="4" />
          <ellipse cx="33" cy="41" rx="6" ry="4.4" />
          <ellipse cx="44" cy="36" rx="5" ry="3.8" />
        </g>
      </BowlFill>
      <path d="M26 31c2-2 5-2 6 0-2 2-4 2-6 0Z" fill={C.green} />
    </>
  )
}

function Chips() {
  return (
    <>
      <path d="M18 26h28l-4 26H22Z" fill="#f3d9d3" stroke="#dcb8b0" strokeWidth="1.2" strokeLinejoin="round" />
      <g fill={C.potato} stroke={C.potatoDark} strokeWidth="0.9">
        <rect x="18" y="14" width="5" height="18" rx="2.4" transform="rotate(-14 20.5 23)" />
        <rect x="26" y="12" width="5" height="19" rx="2.4" transform="rotate(-4 28.5 21.5)" />
        <rect x="33" y="13" width="5" height="19" rx="2.4" transform="rotate(6 35.5 22.5)" />
        <rect x="40" y="15" width="5" height="18" rx="2.4" transform="rotate(15 42.5 24)" />
      </g>
    </>
  )
}

function Crisps() {
  return (
    <>
      <Bowl />
      <BowlFill>
        <ellipse cx="32" cy="34" rx="23" ry="7" fill="#f0dcb4" />
        <path d="M9 34h46v20H9Z" fill="#f0dcb4" />
      </BowlFill>
      <g fill="#e8c887" stroke={C.potatoDark} strokeWidth="0.8">
        <ellipse cx="20" cy="31" rx="7" ry="4" transform="rotate(-16 20 31)" />
        <ellipse cx="34" cy="29" rx="7" ry="4" transform="rotate(8 34 29)" />
        <ellipse cx="45" cy="32" rx="6.5" ry="3.8" transform="rotate(-6 45 32)" />
        <ellipse cx="27" cy="36" rx="6.5" ry="3.6" transform="rotate(10 27 36)" />
      </g>
    </>
  )
}

function Waffle() {
  return (
    <>
      <Plate />
      <rect x="16" y="20" width="32" height="24" rx="6" fill={C.leaf} stroke="#6fa25b" strokeWidth="1.2" />
      <g stroke="#6fa25b" strokeWidth="1.4" opacity="0.85">
        <path d="M24 20v24M32 20v24M40 20v24M16 28h32M16 36h32" />
      </g>
      <circle cx="21" cy="25" r="1.4" fill="#3f7a45" />
      <circle cx="44" cy="39" r="1.4" fill="#3f7a45" />
      <circle cx="36" cy="24" r="1.2" fill="#e08a45" />
    </>
  )
}

function KatsuSauce() {
  return (
    <>
      <path d="M46 20 58 15" stroke="#b9c1c3" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="43" cy="22" rx="7" ry="4.5" fill="#dbe0e2" stroke={C.bowlEdge} strokeWidth="1" transform="rotate(-22 43 22)" />
      <path
        d="M14 34h36c0 10-8 17-18 17s-18-7-18-17Z"
        fill={C.bowl}
        stroke={C.bowlEdge}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <ellipse cx="32" cy="34" rx="18" ry="5" fill="#c98b2e" stroke={C.bowlEdge} strokeWidth="1.2" />
      <path d="M22 34c6-3 16-3 20 0" stroke="#e0a94c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  )
}

function Soup() {
  return (
    <>
      <Bowl />
      <BowlFill>
        <ellipse cx="32" cy="34" rx="23" ry="7" fill={C.tomatoLight} />
        <path d="M9 34h46v20H9Z" fill={C.tomatoLight} />
      </BowlFill>
      <path
        d="M20 35c4-3 8 2 12-1s8 2 12-1"
        stroke="#f0e2d2"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M28 31c2-2 5-2 6 0-2 2-4 2-6 0Z" fill={C.leaf} />
    </>
  )
}

function Pizza() {
  return (
    <>
      <circle cx="32" cy="36" r="22" fill={C.bread} stroke="#cfa96a" strokeWidth="1.4" />
      <circle cx="32" cy="36" r="17" fill={C.tomatoLight} />
      <g stroke="#cfa96a" strokeWidth="1" opacity="0.7">
        <path d="M32 19v34M15 36h34M20 24l24 24M44 24 20 48" />
      </g>
      <g fill="#f7edd2">
        <circle cx="25" cy="30" r="3" />
        <circle cx="39" cy="31" r="2.6" />
        <circle cx="31" cy="42" r="3" />
        <circle cx="41" cy="41" r="2.4" />
      </g>
      <path d="M22 40c2-2 5-2 6 0-2 2-4 2-6 0Z" fill={C.green} />
    </>
  )
}

function WatermelonJelly() {
  return (
    <>
      <path d="M8 26a24 24 0 0 0 48 0Z" fill={C.rind} />
      <path d="M11 27a21 21 0 0 0 42 0Z" fill="#e8f2e4" />
      <path d="M14 28a18 18 0 0 0 36 0Z" fill={C.melon} />
      <g fill="#3d1f28">
        <ellipse cx="24" cy="34" rx="1.4" ry="2" />
        <ellipse cx="32" cy="38" rx="1.4" ry="2" />
        <ellipse cx="40" cy="34" rx="1.4" ry="2" />
        <ellipse cx="32" cy="30" rx="1.4" ry="2" />
      </g>
      <path d="M8 26h48" stroke={C.rind} strokeWidth="2" strokeLinecap="round" />
    </>
  )
}

function Lemonade() {
  return (
    <>
      <path d="M20 16h24l-3 36a4 4 0 0 1-4 3h-10a4 4 0 0 1-4-3Z" fill="#eef4f5" stroke={C.bowlEdge} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M21.6 24h20.8l-2.4 28a3 3 0 0 1-3 2.4h-10a3 3 0 0 1-3-2.4Z" fill="#f6e07a" />
      <circle cx="27" cy="32" r="3" fill="#fdf6d8" opacity="0.8" />
      <circle cx="36" cy="41" r="2.4" fill="#fdf6d8" opacity="0.8" />
      <path d="M38 18a6 6 0 0 1 0 12 6 6 0 0 1 0-12Z" fill={C.lemon} stroke="#c9a52c" strokeWidth="1" />
      <path d="M38 19v10M34 24h8" stroke="#fdf6d8" strokeWidth="1" />
    </>
  )
}

/* --------------------------------------------------------------------- registry */

const ART: Record<DishArt, () => ReactNode> = {
  'chicken-cream': ChickenCream,
  'chicken-couscous': ChickenCouscous,
  'chicken-wrap': () => <Wrap />,
  'beef-wrap': () => <Wrap filling={C.beef} />,
  kiev: Kiev,
  'crispy-chicken': CrispyChicken,
  tenders: Tenders,
  traybake: Traybake,
  'meal-prep': MealPrepBox,
  'pasta-red': () => <PastaBowl sauce={C.tomato} />,
  'pasta-cream': () => <PastaBowl sauce="#f9f1e2" />,
  'pasta-pesto': () => <PastaBowl sauce={C.green} />,
  bolognese: Bolognese,
  chilli: Chilli,
  'burrito-bowl': BurritoBowl,
  'burger-bowl': CheeseburgerBowl,
  meatballs: Meatballs,
  'cottage-pie': CottagePie,
  lasagne: Lasagne,
  'mac-cheese': MacCheese,
  gnocchi: GnocchiBake,
  'lamb-rack': LambRack,
  'lamb-potatoes': LambPotatoes,
  flatbread: Flatbread,
  'fish-chips': FishAndChips,
  salmon: SalmonTraybake,
  'roast-potatoes': RoastPotatoes,
  chips: Chips,
  crisps: Crisps,
  waffle: Waffle,
  'katsu-sauce': KatsuSauce,
  soup: Soup,
  pizza: Pizza,
  'watermelon-jelly': WatermelonJelly,
  lemonade: Lemonade,
}

/**
 * The picture for one meal idea: the photograph if the recipe has one in
 * `src/assets/recipes/`, otherwise the drawing above.
 *
 * Decorative either way — the recipe's name sits next to it in every place it is used, so
 * announcing the picture as well would only repeat that.
 */
export function RecipeImage({ recipe, className = '' }: { recipe: Recipe; className?: string }) {
  const photo = recipePhoto(recipe.id)

  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        loading="lazy"
        decoding="async"
        className={`object-cover ${className}`}
        style={{ background: CATEGORY_TINT[recipe.category] }}
      />
    )
  }

  const Dish = ART[recipe.art]
  return (
    <svg
      // Tighter than the 64 × 64 the dishes are drawn on: the drawings leave a margin the
      // thumbnail doesn't need, and cropping it back fills the tile.
      viewBox="5 9 54 50"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ background: CATEGORY_TINT[recipe.category] }}
    >
      <Dish />
    </svg>
  )
}
