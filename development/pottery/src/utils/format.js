export const rub = (value) => new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 0
}).format(value)

export const dateLong = (iso) => new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long', day: 'numeric', month: 'long'
}).format(new Date(iso))

export const dateShort = (iso) => new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'short'
}).format(new Date(iso))

export const time = (iso) => new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit', minute: '2-digit'
}).format(new Date(iso))

export const dateTime = (iso) => `${dateShort(iso)}, ${time(iso)}`

export function addMinutes(iso, minutes) {
  return new Date(new Date(iso).getTime() + minutes * 60000).toISOString()
}

export function durationText(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} ч ${m} мин` : `${h} ч`
}

export function phonePretty(raw) {
  const digits = String(raw || '').replace(/\D/g, '')
  const d = digits.startsWith('8') ? `7${digits.slice(1)}` : digits
  if (d.length < 11) return raw
  return `+${d[0]} ${d.slice(1,4)} ${d.slice(4,7)}-${d.slice(7,9)}-${d.slice(9,11)}`
}

export function daysFromToday(days = 7) {
  const start = new Date(); start.setHours(0,0,0,0)
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i)
    return d
  })
}

export function toDateInput(date) {
  return new Date(date).toISOString().slice(0, 10)
}
