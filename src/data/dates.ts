/** Date helpers. Everything is a local `yyyy-mm-dd` string so days never shift by timezone. */

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function addDays(iso: string, days: number): string {
  const date = fromISODate(iso)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

/** Monday-first start of the week containing `iso`. */
export function startOfWeek(iso: string): string {
  const date = fromISODate(iso)
  const offset = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - offset)
  return toISODate(date)
}

export function weekDates(anchorISO: string): string[] {
  const start = startOfWeek(anchorISO)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

/** The last `count` days, oldest first, ending today. */
export function recentDates(count: number, endISO = todayISO()): string[] {
  return Array.from({ length: count }, (_, i) => addDays(endISO, i - (count - 1)))
}

const weekdayShort = new Intl.DateTimeFormat('en-GB', { weekday: 'short' })
const dayLong = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
const dayMedium = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
const dayNumber = new Intl.DateTimeFormat('en-GB', { day: 'numeric' })

export function formatWeekdayShort(iso: string): string {
  return weekdayShort.format(fromISODate(iso))
}

export function formatDayNumber(iso: string): string {
  return dayNumber.format(fromISODate(iso))
}

export function formatDayLong(iso: string): string {
  return dayLong.format(fromISODate(iso))
}

/** "Today" / "Yesterday" / "Tomorrow", falling back to a short date. */
export function formatDayRelative(iso: string): string {
  const today = todayISO()
  if (iso === today) return 'Today'
  if (iso === addDays(today, -1)) return 'Yesterday'
  if (iso === addDays(today, 1)) return 'Tomorrow'
  return dayMedium.format(fromISODate(iso))
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}
