<script setup>
import { onMounted, ref } from 'vue'
import { shouldAskPushAfterBooking, markPushAsked, updateNotificationSettings } from '../api/mockApi.js'
import { dateShort, time, addMinutes, rub } from '../utils/format.js'
import Modal from './Modal.vue'
const props = defineProps({ booking: Object })
const emit = defineEmits(['close', 'bookings', 'toast'])
const askPush = ref(false)
onMounted(()=>{ askPush.value = shouldAskPushAfterBooking() })
async function enablePush() {
  await markPushAsked()
  if (!('Notification' in window)) { emit('toast', 'Ваш браузер не поддерживает push-уведомления'); askPush.value=false; return }
  const permission = await Notification.requestPermission()
  if (permission === 'granted') { await updateNotificationSettings({ push_enabled: true, reminders_enabled: true, cancellation_enabled: true, subscription_endpoint: 'demo-endpoint' }); emit('toast','Уведомления включены') }
  else emit('toast','Уведомления можно включить позже в профиле')
  askPush.value = false
}
function skip() { markPushAsked(); askPush.value=false }
</script>
<template>
  <Modal title="Вы записаны" :closeable="true" @close="emit('close')">
    <div class="notice success"><b>Запись подтверждена сразу.</b></div>
    <div class="kv"><div class="kv-row"><span>Когда</span><b>{{ dateShort(booking.slot.start_at) }}, {{ time(booking.slot.start_at) }}—{{ time(addMinutes(booking.slot.start_at, booking.slot.duration_minutes)) }}</b></div><div class="kv-row"><span>Программа</span><b>{{ booking.slot.program.name }}</b></div><div class="kv-row"><span>Мастер</span><b>{{ booking.slot.master.name }}</b></div><div class="kv-row"><span>Инструменты</span><b>{{ booking.use_rental ? 'Прокат инструментов и фартука' : 'Свои инструменты и фартук' }}</b></div><div class="kv-row"><span>Итого</span><b>{{ rub(booking.price_total) }}</b></div></div>
    <p>Оплата на месте: наличные или перевод на карту.</p>
    <div v-if="askPush" class="notice"><b>Включить напоминания?</b><p>Мы напомним о записи и предупредим, если занятие отменит мастерская.</p><button class="btn secondary" @click="enablePush">Включить уведомления</button> <button class="btn link" @click="skip">Не сейчас</button></div>
    <div style="display:grid; gap:10px"><button class="btn primary full" @click="emit('bookings')">Мои записи</button><button class="btn ghost full" @click="emit('close')">Готово</button></div>
  </Modal>
</template>
