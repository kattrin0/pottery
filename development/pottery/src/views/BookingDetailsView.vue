<script setup>
import { computed, onMounted, ref } from 'vue'
import { getBooking } from '../api/mockApi.js'
import { dateLong, time, addMinutes, rub } from '../utils/format.js'
import StatusBadge from '../components/StatusBadge.vue'
import CancelConfirmModal from '../components/CancelConfirmModal.vue'
import RatingModal from '../components/RatingModal.vue'

const props = defineProps({ id: String })
const emit = defineEmits(['back', 'toast'])

const booking = ref(null)
const loading = ref(true)
const cancelOpen = ref(false)
const ratingOpen = ref(false)

const initials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(x => x[0]).join('').slice(0, 2)
}

async function load() {
  loading.value = true
  try {
    booking.value = await getBooking(props.id)
  } catch (e) {
    emit('toast', e.message || 'Не удалось загрузить запись')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const isPast = computed(() => booking.value && new Date(booking.value.slot.start_at) <= new Date())
const canCancel = computed(() => booking.value?.status === 'active' && !isPast.value)
const canRate = computed(() => booking.value?.status === 'active' && isPast.value && !booking.value.rating)
</script>

<template>
  <button class="btn link back" @click="emit('back')">‹ Назад к моим записям</button>
  <div v-if="loading" class="skeleton"></div>
  <div v-else-if="!booking" class="card error">Запись не найдена</div>
  <div v-else class="two-col">
    <section class="card panel">
      <div style="display:flex; justify-content:space-between; gap:12px">
        <h1>Детали записи</h1>
        <StatusBadge :status="booking.status" />
      </div>
      <h2>{{ dateLong(booking.slot.start_at) }}</h2>
      <div class="price">{{ time(booking.slot.start_at) }}—{{ time(addMinutes(booking.slot.start_at, booking.slot.duration_minutes)) }}</div>
      <div class="kv" style="margin-top:20px">
        <div class="kv-row"><span>Программа</span><b>{{ booking.slot.program?.name || '—' }}</b></div>
        <div class="kv-row"><span>Инструменты</span><b>{{ booking.use_rental ? 'Прокат инструментов и фартука' : 'Свои инструменты и фартук' }}</b></div>
        <div class="kv-row"><span>Итого</span><b>{{ rub(booking.price_total) }}</b></div>
      </div>
      <div v-if="booking.status === 'cancelled_by_workshop'" class="notice danger">
        <b>Занятие отменено мастерской.</b><br/>
        Причина: {{ booking.cancellation_reason || booking.slot.cancellation_reason }}
      </div>
      <div class="notice">Оплата на месте: наличные или перевод на карту.</div>
    </section>
    <aside class="card panel">
      <div class="master">
        <span class="avatar lg">{{ initials(booking.slot.master?.name) }}</span>
        <div>
          <h3>{{ booking.slot.master?.name || 'Мастер не указан' }}</h3>
          <div class="meta">Мастер</div>
        </div>
      </div>
      <div class="kv" style="margin-top:20px">
        <div class="kv-row"><span>Адрес</span><b>{{ booking.slot.address }}</b></div>
        <div v-if="booking.rating" class="kv-row"><span>Ваша оценка</span><b>{{ booking.rating.score }} из 5 ★</b></div>
      </div>
      <button v-if="canCancel" class="btn danger full" style="margin-top:22px" @click="cancelOpen=true">Отменить запись</button>
      <button v-if="canRate" class="btn primary full" style="margin-top:12px" @click="ratingOpen=true">Оценить мастера</button>
    </aside>
  </div>
  <CancelConfirmModal v-if="cancelOpen" :id="booking.id" @close="cancelOpen=false" @toast="emit('toast',$event)" @cancelled="cancelOpen=false; load(); emit('back')" />
  <RatingModal v-if="ratingOpen" :booking="booking" @close="ratingOpen=false" @toast="emit('toast',$event)" @saved="ratingOpen=false; load()" />
</template>