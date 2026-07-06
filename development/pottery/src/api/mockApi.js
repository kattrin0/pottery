const STORAGE_KEY = 'goncharka-demo-v1'
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))
const uid = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2)
const today = new Date()
const at = (plusDays, hour, minute = 0) => {
  const d = new Date(today)
  d.setDate(today.getDate() + plusDays)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const seed = {
  currentUser: null,
  users: [],
  otp: {},
  firstBookingPushAsked: false,
  programs: [
    { id: 'p1', name: 'Лепка для новичков', description: 'Спокойный мастер-класс для первого знакомства с глиной. Подходит без опыта.', max_participants: 6 },
    { id: 'p2', name: 'Гончарный круг', description: 'Работа на гончарном круге для тех, кто уже пробовал или хочет освоить базовую форму.', max_participants: 10 }
  ],
  masters: [
    { id: 'm1', name: 'Елена Орехова', photo_url: '' },
    { id: 'm2', name: 'Виктор Труфанов', photo_url: '' },
    { id: 'm3', name: 'Ксения Нечаева', photo_url: '' },
    { id: 'm4', name: 'Дарина Веретенникова', photo_url: '' }
  ],
  rental: { id: 'r1', tariff: 150, free_count: 4 },
  cancellationPolicy: { id: 'cp1', threshold_hours: 2, penalty_percent: 50 },
  bookings: [],
  ratings: [],
  notificationSettings: {},
  slots: []
}

// ===== Новая функция для начального обогащения слотов (без обращения к db) =====
function enrichSlotWithSeed(slot) {
  const program = seed.programs.find(p => p.id === slot.program_id)
  const master = seed.masters.find(m => m.id === slot.master_id)
  return { ...slot, program, master }
}

function makeSlots() {
  const programs = seed.programs
  const masters = seed.masters
  const slots = [
    [0, 4, 'p1', 'm1', 6, 3, 1200, 'scheduled'],
    [1, 19, 'p2', 'm2', 10, 5, 1500, 'scheduled'],
    [2, 10, 'p1', 'm3', 6, 0, 1200, 'scheduled'],
    [3, 12, 'p2', 'm4', 10, 2, 1500, 'scheduled'],
    [3, 17, 'p1', 'm1', 6, 1, 1300, 'scheduled'],
    [4, 18, 'p2', 'm2', 10, 0, 1600, 'scheduled'],
    [5, 11, 'p1', 'm3', 6, 6, 1200, 'scheduled'],
    [6, 16, 'p2', 'm4', 10, 4, 1500, 'scheduled'],
    [8, 18, 'p1', 'm1', 6, 5, 1200, 'scheduled'],
    [11, 19, 'p2', 'm2', 10, 8, 1500, 'scheduled'],
    [13, 12, 'p1', 'm3', 6, 2, 1300, 'cancelled'],
    [18, 17, 'p2', 'm4', 10, 6, 1600, 'scheduled'],
    [25, 18, 'p1', 'm1', 6, 6, 1200, 'scheduled']
  ]
  return slots.map((s, index) => ({
    id: `s${index + 1}`,
    start_at: at(s[0], s[1]),
    duration_minutes: s[2] === 'p1' ? 120 : 150,
    program_id: s[2],
    master_id: s[3],
    total_seats: s[4],
    free_seats: s[5],
    price: s[6],
    status: s[7],
    cancellation_reason: s[7] === 'cancelled' ? 'Отключение электричества в мастерской' : null,
    address: 'ул. Гончарная, 12, цех 3',
    description: programs.find(p => p.id === s[2])?.description,
  })).map(enrichSlotWithSeed)   
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const initial = { ...seed, slots: makeSlots() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
  const data = JSON.parse(raw)
  if (!data.slots?.length) data.slots = makeSlots()
  return data
}

let db = load()

// ===== Основная функция обогащения (использует db) =====
function enrichSlot(slot) {
  const program = (db?.programs || seed.programs).find(p => p.id === slot.program_id)
  const master = (db?.masters || seed.masters).find(m => m.id === slot.master_id)
  return { ...slot, program, master }
}

function enrichBooking(booking) {
  const slot = enrichSlot(db.slots.find(s => s.id === booking.slot_id))
  const rating = db.ratings.find(r => r.booking_id === booking.id)
  return { ...booking, slot, rating }
}

function requireUser() {
  if (!db.currentUser) { const err = new Error('Unauthorized'); err.status = 401; throw err }
  return db.currentUser
}

function statusError(code, message) { const e = new Error(message); e.code = code; e.status = 409; return e }

export async function sendOtp(phone) {
  await delay()
  const normalized = phone.replace(/\D/g, '').replace(/^8/, '7')
  db.otp[normalized] = '1111'
  save()
  return { ok: true, demoCode: '1111' }
}

export async function verifyOtp(phone, code) {
  await delay()
  const normalized = phone.replace(/\D/g, '').replace(/^8/, '7')
  if (db.otp[normalized] !== code) throw statusError('invalid_code', 'Неверный код')
  let user = db.users.find(u => u.phone === normalized)
  if (!user) {
    user = { id: uid(), phone: normalized, created_at: new Date().toISOString(), last_login_at: new Date().toISOString() }
    db.users.push(user)
    db.notificationSettings[user.id] = { push_enabled: false, reminders_enabled: true, cancellation_enabled: true, subscription_endpoint: null }
  } else user.last_login_at = new Date().toISOString()
  db.currentUser = user
  save()
  return { token: 'demo-token', user }
}

export async function logout() { await delay(120); db.currentUser = null; save(); return { ok: true } }
export async function getSession() { await delay(100); return db.currentUser }
export async function getProfile() { await delay(); return requireUser() }
export async function getPrograms() { await delay(180); return db.programs }
export async function getRental() { await delay(180); return db.rental }
export async function getCancellationPolicy() { await delay(180); return db.cancellationPolicy }

export async function getSlots(filters = {}) {
  await delay()
  let slots = db.slots.map(enrichSlot).sort((a, b) => new Date(a.start_at) - new Date(b.start_at))
  const from = filters.from ? new Date(filters.from) : new Date()
  const to = filters.to ? new Date(filters.to) : new Date(Date.now() + 7 * 86400000) // ← 7 дней вместо 30
  to.setHours(23, 59, 59, 999)
  slots = slots.filter(s => new Date(s.start_at) >= from && new Date(s.start_at) <= to)
  if (filters.programIds?.length) slots = slots.filter(s => filters.programIds.includes(s.program_id))
  if (filters.onlyFree) slots = slots.filter(s => s.free_seats > 0 && s.status === 'scheduled')
  return slots
}

export async function getSlot(id) {
  await delay()
  const slot = db.slots.find(s => s.id === id)
  if (!slot) throw statusError('not_found', 'Слот не найден')
  return enrichSlot(slot)
}

export async function createBooking({ slot_id, use_rental }) {
  await delay(650)
  const user = requireUser()
  const slot = db.slots.find(s => s.id === slot_id)
  if (!slot) throw statusError('not_found', 'Слот не найден')
  if (slot.status === 'cancelled') throw statusError('slot_cancelled', 'Занятие отменено мастерской')
  if (slot.free_seats <= 0) throw statusError('no_seats', 'Мест уже нет')
  if (use_rental && db.rental.free_count <= 0) throw statusError('rental_unavailable', 'Прокатных комплектов нет')

  slot.free_seats -= 1
  if (use_rental) db.rental.free_count -= 1
  const booking = {
    id: uid(), slot_id, client_id: user.id, use_rental,
    status: 'active', price_total: slot.price + (use_rental ? db.rental.tariff : 0),
    created_at: new Date().toISOString(), cancelled_at: null, cancellation_reason: null
  }
  db.bookings.push(booking)
  save()
  return enrichBooking(booking)
}

export async function getBookings() {
  await delay()
  const user = requireUser()
  return db.bookings.filter(b => b.client_id === user.id).map(enrichBooking)
}

export async function getBooking(id) {
  await delay()
  const user = requireUser()
  const b = db.bookings.find(x => x.id === id && x.client_id === user.id)
  if (!b) throw statusError('not_found', 'Запись не найдена')
  return enrichBooking(b)
}

export async function previewCancelBooking(id) {
  await delay()
  const booking = await getBooking(id)
  const policy = db.cancellationPolicy
  const msToStart = new Date(booking.slot.start_at) - new Date()
  const hoursToStart = msToStart / 3600000
  const isLate = hoursToStart < policy.threshold_hours
  const penalty_amount = isLate ? Math.round(booking.price_total * policy.penalty_percent / 100) : 0
  return { booking, policy, hours_to_start: Math.max(0, hoursToStart), is_late: isLate, penalty_amount }
}

export async function cancelBooking(id) {
  await delay(550)
  const user = requireUser()
  const b = db.bookings.find(x => x.id === id && x.client_id === user.id)
  if (!b) throw statusError('not_found', 'Запись не найдена')
  if (b.status !== 'active') throw statusError('already_cancelled', 'Эта бронь уже отменена')
  const slot = db.slots.find(s => s.id === b.slot_id)
  const policy = db.cancellationPolicy
  const isLate = ((new Date(slot.start_at) - new Date()) / 3600000) < policy.threshold_hours
  b.status = isLate ? 'late_cancel' : 'cancelled'
  b.cancelled_at = new Date().toISOString()
  if (!isLate) {
    slot.free_seats += 1
    if (b.use_rental) db.rental.free_count += 1
  }
  save()
  return enrichBooking(b)
}

export async function createRating({ booking_id, score, comment }) {
  await delay()
  const booking = await getBooking(booking_id)
  if (db.ratings.some(r => r.booking_id === booking_id)) throw statusError('already_rated', 'Вы уже оставили оценку')
  if (new Date(booking.slot.start_at) > new Date()) throw statusError('not_finished', 'Занятие ещё не прошло')
  const rating = { id: uid(), booking_id, master_id: booking.slot.master_id, score, comment, created_at: new Date().toISOString() }
  db.ratings.push(rating)
  save()
  return rating
}

export async function getNotificationSettings() {
  await delay()
  const user = requireUser()
  return db.notificationSettings[user.id] || { push_enabled: false, reminders_enabled: true, cancellation_enabled: true, subscription_endpoint: null }
}

export async function updateNotificationSettings(patch) {
  await delay(250)
  const user = requireUser()
  db.notificationSettings[user.id] = { ...(db.notificationSettings[user.id] || {}), ...patch }
  save()
  return db.notificationSettings[user.id]
}

export async function markPushAsked() { db.firstBookingPushAsked = true; save() }
export function shouldAskPushAfterBooking() { return !db.firstBookingPushAsked }
export function resetDemoData() { localStorage.removeItem(STORAGE_KEY); db = load() }

const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(db))