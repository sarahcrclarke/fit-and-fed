import type { MealSlot } from './types'

/**
 * The household's meal ideas. Calories are approximate per serving — they're a planning
 * guide, not measured nutrition, so treat them as a starting point and adjust to your
 * own portions.
 */

export type RecipeCategory = 'chicken' | 'beef' | 'lamb' | 'fish' | 'pasta' | 'sides' | 'kids'

export const RECIPE_CATEGORIES: { id: RecipeCategory; label: string }[] = [
  { id: 'chicken', label: 'Chicken' },
  { id: 'beef', label: 'Beef' },
  { id: 'lamb', label: 'Lamb' },
  { id: 'fish', label: 'Fish' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'sides', label: 'Sides & air fryer' },
  { id: 'kids', label: 'Kids & parties' },
]

export type RecipeTag =
  | 'kid-friendly'
  | 'high-protein'
  | 'hidden-veg'
  | 'air-fryer'
  | 'low-calorie'
  | 'seafood'

export const RECIPE_TAGS: { id: RecipeTag; label: string }[] = [
  { id: 'kid-friendly', label: 'Kid-friendly' },
  { id: 'high-protein', label: 'High protein' },
  { id: 'hidden-veg', label: 'Hidden veg' },
  { id: 'air-fryer', label: 'Air fryer' },
  { id: 'low-calorie', label: 'Under 400' },
  { id: 'seafood', label: 'Seafood' },
]

/** Mains are a meal on their own; the rest are things you add to one. */
export type RecipeKind = 'main' | 'side' | 'sauce' | 'drink' | 'sweet'

/**
 * Which drawing stands in for the dish. Kept here so the picture is part of the recipe
 * rather than a lookup table somewhere in the UI; `RecipeImage` renders them. Dishes that
 * genuinely look alike on a plate — the two wraps, the baked pastas — share a drawing.
 */
export type DishArt =
  | 'chicken-cream'
  | 'chicken-couscous'
  | 'chicken-wrap'
  | 'beef-wrap'
  | 'kiev'
  | 'crispy-chicken'
  | 'tenders'
  | 'traybake'
  | 'meal-prep'
  | 'pasta-red'
  | 'pasta-cream'
  | 'pasta-pesto'
  | 'bolognese'
  | 'chilli'
  | 'burrito-bowl'
  | 'burger-bowl'
  | 'meatballs'
  | 'cottage-pie'
  | 'lasagne'
  | 'mac-cheese'
  | 'gnocchi'
  | 'lamb-rack'
  | 'lamb-potatoes'
  | 'flatbread'
  | 'fish-chips'
  | 'salmon'
  | 'roast-potatoes'
  | 'chips'
  | 'crisps'
  | 'waffle'
  | 'katsu-sauce'
  | 'soup'
  | 'pizza'
  | 'watermelon-jelly'
  | 'lemonade'

export interface Recipe {
  id: string
  name: string
  kind: RecipeKind
  category: RecipeCategory
  /** Approximate calories per serving. */
  calories: number
  /** The slot this most naturally lands in — used to prefill the log form. */
  slot: MealSlot
  /** The drawing shown alongside it in the meal ideas list. */
  art: DishArt
  tags: RecipeTag[]
  note?: string
}

export const RECIPES: Recipe[] = [
  // ---------------------------------------------------------------- Chicken
  {
    id: 'creamy-tuscan-chicken',
    name: 'Creamy Tuscan Chicken',
    kind: 'main',
    category: 'chicken',
    calories: 520,
    slot: 'dinner',
    art: 'chicken-cream',
    tags: ['high-protein'],
    note: 'Spinach and sun-dried tomatoes in a creamy sauce. Good with rice or pasta.',
  },
  {
    id: 'lemon-garlic-chicken-couscous',
    name: 'Lemon Garlic Chicken Couscous',
    kind: 'main',
    category: 'chicken',
    calories: 480,
    slot: 'dinner',
    art: 'chicken-couscous',
    tags: ['high-protein'],
    note: 'One-pan; the couscous soaks up the lemon and garlic.',
  },
  {
    id: 'buffalo-chicken-wraps',
    name: 'Buffalo Chicken Wraps',
    kind: 'main',
    category: 'chicken',
    calories: 380,
    slot: 'lunch',
    art: 'chicken-wrap',
    tags: ['high-protein', 'low-calorie'],
    note: 'Comes in under 400 kcal. Sauce on the side keeps it kid-safe.',
  },
  {
    id: 'hot-honey-crispy-chicken-wraps',
    name: 'Hot Honey Crispy Chicken Wraps',
    kind: 'main',
    category: 'chicken',
    calories: 520,
    slot: 'lunch',
    art: 'chicken-wrap',
    tags: ['high-protein'],
    note: 'Hold the hot honey on the kids’ portions.',
  },
  {
    id: 'chicken-kiev',
    name: 'Chicken Kiev',
    kind: 'main',
    category: 'chicken',
    calories: 610,
    slot: 'dinner',
    art: 'kiev',
    tags: ['kid-friendly'],
  },
  {
    id: 'creamy-garlic-chicken',
    name: 'Creamy Garlic Chicken',
    kind: 'main',
    category: 'chicken',
    calories: 540,
    slot: 'dinner',
    art: 'chicken-cream',
    tags: ['high-protein'],
  },
  {
    id: 'crispy-air-fryer-chicken',
    name: 'Crispy Air Fryer Chicken',
    kind: 'main',
    category: 'chicken',
    calories: 430,
    slot: 'dinner',
    art: 'crispy-chicken',
    tags: ['high-protein', 'air-fryer', 'kid-friendly'],
  },
  {
    id: 'high-protein-chicken-pasta',
    name: 'High-protein Chicken Pasta',
    kind: 'main',
    category: 'chicken',
    calories: 590,
    slot: 'dinner',
    art: 'pasta-cream',
    tags: ['high-protein'],
  },
  {
    id: 'hidden-veg-chicken-traybake',
    name: 'Hidden Veg Chicken Traybake',
    kind: 'main',
    category: 'chicken',
    calories: 450,
    slot: 'dinner',
    art: 'traybake',
    tags: ['high-protein', 'hidden-veg', 'kid-friendly'],
    note: 'Everything on one tray — good for a night nobody wants to cook.',
  },
  {
    id: 'chicken-rice-meal-prep',
    name: 'Chicken & Rice Meal Prep',
    kind: 'main',
    category: 'chicken',
    calories: 520,
    slot: 'lunch',
    art: 'meal-prep',
    tags: ['high-protein'],
    note: 'Batch on Sunday, four lunches sorted.',
  },

  // ------------------------------------------------------------------- Beef
  {
    id: 'high-protein-chilli',
    name: 'High-protein Chilli',
    kind: 'main',
    category: 'beef',
    calories: 470,
    slot: 'dinner',
    art: 'chilli',
    tags: ['high-protein', 'hidden-veg'],
    note: 'Freezes well. Mild batch for the kids, hot sauce at the table.',
  },
  {
    id: 'hidden-veg-bolognese',
    name: 'Hidden Veg Bolognese',
    kind: 'main',
    category: 'beef',
    calories: 540,
    slot: 'dinner',
    art: 'bolognese',
    tags: ['hidden-veg', 'kid-friendly', 'high-protein'],
    note: 'Carrot, courgette and mushroom blitzed into the sauce.',
  },
  {
    id: 'loaded-beef-burrito-bowls',
    name: 'Loaded Beef Burrito Bowls',
    kind: 'main',
    category: 'beef',
    calories: 620,
    slot: 'dinner',
    art: 'burrito-bowl',
    tags: ['high-protein'],
    note: 'Build-your-own bowls — the kids pick their own toppings.',
  },
  {
    id: 'cottage-pie-lighter',
    name: 'Cottage Pie (lighter)',
    kind: 'main',
    category: 'beef',
    calories: 490,
    slot: 'dinner',
    art: 'cottage-pie',
    tags: ['hidden-veg', 'kid-friendly'],
  },
  {
    id: 'beef-meatballs-tomato-sauce',
    name: 'Beef Meatballs in Tomato Sauce',
    kind: 'main',
    category: 'beef',
    calories: 450,
    slot: 'dinner',
    art: 'meatballs',
    tags: ['kid-friendly', 'high-protein'],
  },
  {
    id: 'cheeseburger-bowl',
    name: 'Cheeseburger Bowl',
    kind: 'main',
    category: 'beef',
    calories: 510,
    slot: 'dinner',
    art: 'burger-bowl',
    tags: ['high-protein'],
  },

  // ------------------------------------------------------------------- Lamb
  {
    id: 'perfect-rack-of-lamb',
    name: 'Perfect Rack of Lamb',
    kind: 'main',
    category: 'lamb',
    calories: 650,
    slot: 'dinner',
    art: 'lamb-rack',
    tags: [],
    note: 'Weekend or guests-round dinner.',
  },
  {
    id: 'lamb-rosemary-potatoes',
    name: 'Lamb with Rosemary Potatoes',
    kind: 'main',
    category: 'lamb',
    calories: 680,
    slot: 'dinner',
    art: 'lamb-potatoes',
    tags: [],
  },
  {
    id: 'greek-lamb-flatbreads',
    name: 'Greek Lamb Flatbreads',
    kind: 'main',
    category: 'lamb',
    calories: 570,
    slot: 'dinner',
    art: 'flatbread',
    tags: [],
  },

  // ------------------------------------------------------------------- Fish
  {
    id: 'crispy-fish-fingers-chips',
    name: 'Crispy Fish Fingers & Homemade Chips',
    kind: 'main',
    category: 'fish',
    calories: 560,
    slot: 'dinner',
    art: 'fish-chips',
    tags: ['kid-friendly', 'seafood', 'air-fryer'],
    note: 'For the family — contains seafood.',
  },
  {
    id: 'salmon-traybake',
    name: 'Salmon Traybake',
    kind: 'main',
    category: 'fish',
    calories: 520,
    slot: 'dinner',
    art: 'salmon',
    tags: ['seafood', 'high-protein'],
    note: 'For the family — contains seafood.',
  },

  // ------------------------------------------------------------------ Pasta
  {
    id: 'creamy-tomato-pasta',
    name: 'Creamy Tomato Pasta',
    kind: 'main',
    category: 'pasta',
    calories: 520,
    slot: 'dinner',
    art: 'pasta-red',
    tags: ['kid-friendly'],
  },
  {
    id: 'pesto-chicken-pasta',
    name: 'Pesto Chicken Pasta',
    kind: 'main',
    category: 'pasta',
    calories: 610,
    slot: 'dinner',
    art: 'pasta-pesto',
    tags: ['high-protein'],
  },
  {
    id: 'hidden-veg-mac-cheese',
    name: 'Hidden Veg Mac & Cheese',
    kind: 'main',
    category: 'pasta',
    calories: 580,
    slot: 'dinner',
    art: 'mac-cheese',
    tags: ['hidden-veg', 'kid-friendly'],
    note: 'Butternut squash blended into the cheese sauce.',
  },
  {
    id: 'lasagne-lighter',
    name: 'Lasagne (lighter)',
    kind: 'main',
    category: 'pasta',
    calories: 540,
    slot: 'dinner',
    art: 'lasagne',
    tags: ['hidden-veg', 'kid-friendly'],
  },
  {
    id: 'gnocchi-bake',
    name: 'Gnocchi Bake',
    kind: 'main',
    category: 'pasta',
    calories: 500,
    slot: 'dinner',
    art: 'gnocchi',
    tags: ['kid-friendly'],
  },

  // -------------------------------------------------------- Sides & air fryer
  {
    id: 'crispy-chicken-tenders',
    name: 'Crispy Chicken Tenders',
    kind: 'main',
    category: 'sides',
    calories: 380,
    slot: 'dinner',
    art: 'tenders',
    tags: ['air-fryer', 'kid-friendly', 'high-protein', 'low-calorie'],
  },
  {
    id: 'air-fryer-chicken-kiev',
    name: 'Air Fryer Chicken Kiev',
    kind: 'main',
    category: 'sides',
    calories: 520,
    slot: 'dinner',
    art: 'kiev',
    tags: ['air-fryer', 'kid-friendly'],
  },
  {
    id: 'crispy-roast-potatoes',
    name: 'Crispy Roast Potatoes',
    kind: 'side',
    category: 'sides',
    calories: 260,
    slot: 'dinner',
    art: 'roast-potatoes',
    tags: ['air-fryer', 'kid-friendly'],
  },
  {
    id: 'homemade-chips',
    name: 'Homemade Chips',
    kind: 'side',
    category: 'sides',
    calories: 290,
    slot: 'dinner',
    art: 'chips',
    tags: ['air-fryer', 'kid-friendly'],
  },
  {
    id: 'air-fryer-potato-crisps',
    name: 'Air Fryer Potato Crisps',
    kind: 'side',
    category: 'sides',
    calories: 180,
    slot: 'snack',
    art: 'crisps',
    tags: ['air-fryer', 'kid-friendly', 'low-calorie'],
    note: 'Crisps without the packet.',
  },

  // -------------------------------------------------------- Kids & parties
  {
    id: 'savoury-carrot-spinach-waffles',
    name: 'Savoury Carrot & Spinach Waffles',
    kind: 'main',
    category: 'kids',
    calories: 240,
    slot: 'lunch',
    art: 'waffle',
    tags: ['kid-friendly', 'hidden-veg', 'low-calorie'],
    note: 'The kids loved these. Great with katsu sauce for dipping.',
  },
  {
    id: 'homemade-katsu-curry-sauce',
    name: 'Homemade Katsu Curry Sauce',
    kind: 'sauce',
    category: 'kids',
    calories: 120,
    slot: 'dinner',
    art: 'katsu-sauce',
    tags: ['kid-friendly', 'hidden-veg', 'low-calorie'],
    note: 'Goes with the veg waffles, tenders or plain rice.',
  },
  {
    id: 'tomato-soup',
    name: 'Tomato Soup',
    kind: 'main',
    category: 'kids',
    calories: 190,
    slot: 'lunch',
    art: 'soup',
    tags: ['kid-friendly', 'hidden-veg', 'low-calorie'],
  },
  {
    id: 'pizza-night-dough-sauce',
    name: 'Pizza Night Dough & Sauce',
    kind: 'main',
    category: 'kids',
    calories: 420,
    slot: 'dinner',
    art: 'pizza',
    tags: ['kid-friendly'],
    note: 'Base and sauce only — toppings on top of this.',
  },
  {
    id: 'watermelon-jelly-shell',
    name: 'Watermelon Jelly in the Shell',
    kind: 'sweet',
    category: 'kids',
    calories: 70,
    slot: 'snack',
    art: 'watermelon-jelly',
    tags: ['kid-friendly', 'low-calorie'],
    note: 'Party centrepiece — set the jelly in the hollowed-out melon.',
  },
  {
    id: 'lemonade',
    name: 'Lemonade',
    kind: 'drink',
    category: 'kids',
    calories: 90,
    slot: 'snack',
    art: 'lemonade',
    tags: ['kid-friendly', 'low-calorie'],
    note: 'Party jug.',
  },
]

export const KIND_LABELS: Record<RecipeKind, string> = {
  main: 'Main',
  side: 'Side',
  sauce: 'Sauce',
  drink: 'Drink',
  sweet: 'Sweet',
}

export function findRecipe(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id)
}
