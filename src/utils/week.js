const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]

export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function parseDateKey(key) {
  const [year, month, day] = key.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function startOfWeek(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const weekday = start.getDay()
  const diff = weekday === 0 ? -6 : 1 - weekday
  start.setDate(start.getDate() + diff)
  return start
}

export function addDays(date, amount) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  next.setDate(next.getDate() + amount)
  return next
}

export function weekDays(monday) {
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index))
}

export function formatWeekRange(monday) {
  const sunday = addDays(monday, 6)
  const startDay = monday.getDate()
  const endDay = sunday.getDate()
  const startMonth = MONTHS[monday.getMonth()]
  const endMonth = MONTHS[sunday.getMonth()]
  const year = sunday.getFullYear()

  if (monday.getMonth() === sunday.getMonth()) {
    return `${startDay}-${endDay} de ${startMonth} de ${year}`
  }

  return `${startDay} de ${startMonth} – ${endDay} de ${endMonth} de ${year}`
}

export function formatDayHeading(date) {
  const mondayBased = date.getDay() === 0 ? 6 : date.getDay() - 1
  return `${DAY_LABELS[mondayBased]} ${date.getDate()}`
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
