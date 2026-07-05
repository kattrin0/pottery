<script setup>
import { computed, onMounted, ref } from 'vue'
import { getSlot, getRental, createBooking, shouldAskPushAfterBooking, markPushAsked, updateNotificationSettings } from '../api/mockApi.js'
import { dateShort, time, addMinutes, rub } from '../utils/format.js'
import Modal from '../components/Modal.vue'
const props = defineProps({ id: String })
const emit = defineEmits(['back', 'success', 'to-schedule', 'toast'])
const slot = ref(null), rental = ref(null), useRental = ref(false), loading = ref(true), saving = ref(false), noSeats = ref(false)
const total = computed(() => (slot.value?.price || 0) + (useRental.value && rental.value ? rental.value.tariff : 0))
onMounted(async()=>{ slot.value = await getSlot(props.id); rental.value = await getRental(); loading.value=false })
async function submit() {
  saving.value = true
  try { const booking = await createBooking({ slot_id: props.id, use_rental: useRental.value }); emit('success', booking) }
  catch(e) { if (e.code === 'no_seats') noSeats.value = true; else emit('toast', e.message || 'Ошибка соединения. Попробуйте позже') }
  finally { saving.value = false }
}
</script>
<template>
  <button class="btn link back" @click="emit('back')">‹ Назад</button>
  <div v-if="loading" class="skeleton"></div>
  <div v-else class="two-col">
    <section class="card panel"><h1>Бронирование</h1><p>Одна бронь — одно место. Подтверждение приходит сразу после ответа API.</p><h2>{{ slot.program.name }}</h2><p><b>{{ dateShort(slot.start_at) }}, {{ time(slot.start_at) }}—{{ time(addMinutes(slot.start_at, slot.duration_minutes)) }}</b></p><p>Мастер: {{ slot.master.name }}</p><p>Адрес: {{ slot.address }}</p></section>
    <aside class="card panel"><h2>Инструменты и фартук</h2>
      <label class="radio-card"><input type="radio" :value="false" v-model="useRental" /> Свои инструменты и фартук</label>
      <label class="radio-card"><input type="radio" :value="true" v-model="useRental" :disabled="rental.free_count <= 0" /> Прокат инструментов и фартука <b style="margin-left:auto">+{{ rub(rental.tariff) }}</b></label>
      <p v-if="useRental" class="meta">В наличии: {{ rental.free_count }} комплекта</p>
      <div class="kv" style="margin-top:18px"><div class="kv-row"><span>Занятие</span><b>{{ rub(slot.price) }}</b></div><div class="kv-row"><span>Прокат</span><b>{{ useRental ? rub(rental.tariff) : '0 ₽' }}</b></div><div class="kv-row"><span>Итого</span><b class="price">{{ rub(total) }}</b></div></div>
      <div class="notice">Оплата на месте: наличные или перевод на карту.</div>
      <button class="btn primary full" :disabled="saving || slot.free_seats === 0" @click="submit">{{ saving ? 'Записываем…' : 'Записаться' }}</button>
    </aside>
  </div>
  <Modal v-if="noSeats" title="Мест уже нет" @close="noSeats=false"><p>К сожалению, мест уже нет. Выберите другой слот.</p><button class="btn primary full" @click="emit('to-schedule')">К расписанию</button></Modal>
</template>
